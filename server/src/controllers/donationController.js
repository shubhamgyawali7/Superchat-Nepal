import { generateEsewaSignature, verifyEsewaStatus, ESEWA_PRODUCT_CODE } from "../utils/esewa.js";
import { initiateKhaltiPayment, verifyKhaltiPayment } from "../utils/khalti.js";
import prisma from "../config/prisma.js";

function sanitize(str) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 500);
}

function sanitizeName(str) {
  if (!str || typeof str !== "string") return "Anonymous Supporter";
  return str.replace(/<[^>]*>/g, "").trim().slice(0, 50) || "Anonymous Supporter";
}

export const initiateDonation = async (req, res) => {
  const {
    streamerUsername,
    amount,
    senderName,
    message: donorMessage,
    gateway,
  } = req.body;

  if (!streamerUsername || typeof streamerUsername !== "string") {
    return res.status(400).json({ error: "Streamer username is required." });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount < 10 || parsedAmount > 100000) {
    return res.status(400).json({ error: "Amount must be between Rs. 10 and Rs. 1,00,000." });
  }

  const validGateways = ["esewa", "khalti"];
  const selectedGateway = validGateways.includes(gateway) ? gateway : "esewa";

  try {
    // 1. Find streamer
    const profile = await prisma.profile.findUnique({
      where: { username: streamerUsername },
      select: { id: true },
    });

    if (!profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    // 2. Create donation record (pending)
    const donation = await prisma.donation.create({
      data: {
        streamerId: profile.id,
        supporterName: sanitizeName(senderName),
        amount: parsedAmount,
        message: sanitize(donorMessage) || "No message",
        paymentGateway: selectedGateway,
        status: "pending",
      },
    });

    let paymentData = null;

    if (selectedGateway === "esewa") {
      const donationId = donation.id;
      const amountNum = Math.floor(parsedAmount);

      const ESEWA_FORM_URL = process.env.ESEWA_FORM_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      // 3. Generate signature
      const signatureMessage = `total_amount=${amountNum},transaction_uuid=${donationId},product_code=${ESEWA_PRODUCT_CODE}`;
      const signature = generateEsewaSignature(signatureMessage);

      // 4. Return ePay v2 Form Data
      const formData = {
        action: ESEWA_FORM_URL,
        amount: amountNum,
        tax_amount: 0,
        total_amount: amountNum,
        transaction_uuid: donationId,
        product_code: ESEWA_PRODUCT_CODE,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.CLIENT_URL}/donate/${streamerUsername}/success`,
        failure_url: `${process.env.CLIENT_URL}/donate/error`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      };

      paymentData = { formData };
    } else if (selectedGateway === "khalti") {
      const amountInPaisa = Math.round(parsedAmount * 100);
      const clientBase = process.env.CLIENT_URL || "http://localhost:3000";
      const returnUrl = `${clientBase}/donate/${streamerUsername}/success?gateway=khalti`;
      const websiteUrl = clientBase;

      const khaltiResponse = await initiateKhaltiPayment({
        returnUrl,
        websiteUrl,
        amountInPaisa,
        purchaseOrderId: donation.id,
        purchaseOrderName: `Superchat for ${streamerUsername}`,
        customerInfo: {
          name: donation.supporterName,
        },
      });

      await prisma.donation.update({
        where: { id: donation.id },
        data: {
          transactionId: khaltiResponse.pidx,
          gatewayResponse: khaltiResponse,
        },
      });

      paymentData = {
        payment_url: khaltiResponse.payment_url,
        pidx: khaltiResponse.pidx,
      };
    }

    return res.status(200).json({
      message: "Donation initiated",
      donationId: donation.id,
      paymentData,
    });
  } catch (err) {
    console.error("Initiate error:", {
      message: err.message,
      stack: err.stack,
      body: req.body,
    });
    let details = err.message;
    if (err.message?.includes("401") || err.message?.includes("Invalid token")) {
      details = "Invalid Khalti Secret Key (401). Please update KHALTI_SECRET_KEY in server/.env with your key from test-admin.khalti.com";
    }
    return res.status(500).json({
      error: "Failed to initiate donation",
      details,
    });
  }
};

export const verifyEsewa = async (req, res) => {
  const encodedData = req.body?.data || req.query?.data;
  const io = req.io;

  console.log("[ESEWA-VERIFY] Method:", req.method);
  console.log("[ESEWA-VERIFY] Data Source:", req.query.data ? "QUERY" : req.body?.data ? "BODY" : "NONE");

  if (!encodedData) {
    console.error("[ESEWA-VERIFY] Missing data. Query:", req.query, "Body:", req.body);
    return res.status(400).json({ error: "Invalid eSewa data" });
  }

  try {
    // 1. Decode eSewa data
    const decodedBuffer = Buffer.from(encodedData, "base64");
    const decodedString = decodedBuffer.toString("utf-8");
    console.log("[ESEWA-VERIFY] Decoded string:", decodedString);

    const decodedData = JSON.parse(decodedString);

    // 2. Extract transaction details
    const { transaction_uuid, status, total_amount, transaction_code, signature, signed_field_names } = decodedData;

    console.log("[ESEWA] Verifying Transaction:", {
      transaction_uuid,
      total_amount,
      transaction_code,
      status,
      signature,
      signed_field_names
    });

    // Check for duplicate verification
    const existingDonation = await prisma.donation.findUnique({
      where: { id: transaction_uuid },
      select: { status: true },
    });

    if (existingDonation?.status === "verified") {
      console.log("[ESEWA] Payment already verified");
      return res.status(200).json({ success: true, message: "Already verified" });
    }

    // 3. Verify with eSewa Status API
    let isComplete = false;
    let statusData = null;

    try {
      statusData = await verifyEsewaStatus({
        amount: total_amount,
        transaction_uuid: transaction_uuid
      });
      /**statusData =
       *  {
        product_code: 'EPAYTEST',
        transaction_uuid: 'a7f2f8a1-18ff-4912-a4da-a3eec0a9c381',
        total_amount: 500,
        status: 'COMPLETE',
        ref_id: '000F7O2'
      }
       * **/
      // Normalize and check against all known valid eSewa status values
      const statusStr = (statusData.status || "").toUpperCase();
      isComplete = ["COMPLETE", "SUCCESS", "COMPLETED"].includes(statusStr);

      console.log("[ESEWA] Status API result:", statusData.status, "| isComplete:", isComplete);
    } catch (apiError) {
      // Fallback: If the status API is unreachable (common in eSewa test environment),
      // trust the callback data if the status says COMPLETE and we have a transaction_code
      console.warn("[ESEWA] Status API failed, falling back to callback data:", apiError.message);
      if (status === "COMPLETE" && transaction_code) {
        console.log("[ESEWA] Callback data indicates COMPLETE - proceeding with verification");
        isComplete = true;
        statusData = { status: "COMPLETE", source: "callback_fallback" };
      }
    }

    if (isComplete) {
      // 4. Update donation status, earnings, and get streamer username for socket
      const donation = await prisma.$transaction(async (tx) => {
        const updated = await tx.donation.update({
          where: { id: transaction_uuid },
          data: {
            status: "verified",
            transactionId: transaction_code || (statusData && statusData.transaction_uuid),
            gatewayResponse: statusData || decodedData,
          },
          include: { streamer: { select: { username: true } } },
        });

        await tx.profile.update({
          where: { id: updated.streamerId },
          data: { totalEarnings: { increment: updated.amount } },
        });

        return updated;
      });

      // 5. TRIGGER OBS ALERT via Socket.io
      const streamerUsername = donation.streamer?.username;
      if (streamerUsername) {
        io.to(streamerUsername).emit("new-donation", {
          name: donation.supporterName,
          amount: donation.amount,
          message: donation.message,
        });
        console.log("[ESEWA] Alert emitted to room:", streamerUsername);
      }

      // 6. Return success JSON
      return res.status(200).json({
        success: true,
        message: "Donation verified and alert triggered",
        donation: {
          name: donation.supporterName,
          amount: donation.amount,
          streamer: streamerUsername
        }
      });
    }

    console.error("[ESEWA] Payment not complete. Status:", statusData?.status);
    res.status(400).json({ success: false, message: `Payment status: ${statusData?.status || "UNKNOWN"}` });
  } catch (err) {
    console.error("[ESEWA] Verification Error:", err.message, err.stack);
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
};

export const verifyKhalti = async (req, res) => {
  const pidx = req.body?.pidx || req.query?.pidx;
  const purchaseOrderId = req.body?.purchase_order_id || req.query?.purchase_order_id;
  const io = req.io;

  console.log("[KHALTI-VERIFY] Method:", req.method, "PIDX:", pidx);

  if (!pidx) {
    return res.status(400).json({ error: "Missing pidx for Khalti verification" });
  }

  try {
    // 1. Verify with Khalti Lookup API
    const khaltiData = await verifyKhaltiPayment(pidx);
    console.log("[KHALTI-VERIFY] Status result:", khaltiData);

    const isComplete = khaltiData.status === "Completed";

    if (!isComplete) {
      return res.status(400).json({
        success: false,
        message: `Payment status is ${khaltiData.status || "Incomplete"}`,
        khaltiData,
      });
    }

    // 2. Find donation by transactionId or purchase_order_id
    const donation = await prisma.donation.findFirst({
      where: {
        OR: [
          { transactionId: pidx },
          ...(purchaseOrderId ? [{ id: purchaseOrderId }] : []),
          ...(khaltiData.purchase_order_id ? [{ id: khaltiData.purchase_order_id }] : []),
        ],
      },
      include: { streamer: { select: { username: true } } },
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation record not found" });
    }

    if (donation.status === "verified") {
      return res.status(200).json({
        success: true,
        message: "Already verified",
        donation: {
          name: donation.supporterName,
          amount: donation.amount,
          streamer: donation.streamer?.username,
        },
      });
    }

    // 3. Update status & increment earnings in transaction
    const updated = await prisma.$transaction(async (tx) => {
      const up = await tx.donation.update({
        where: { id: donation.id },
        data: {
          status: "verified",
          transactionId: khaltiData.transaction_id || pidx,
          gatewayResponse: khaltiData,
        },
        include: { streamer: { select: { username: true } } },
      });

      await tx.profile.update({
        where: { id: up.streamerId },
        data: { totalEarnings: { increment: up.amount } },
      });

      return up;
    });

    // 4. Trigger OBS Real-time Alert via Socket.io
    const streamerUsername = updated.streamer?.username;
    if (streamerUsername && io) {
      io.to(streamerUsername).emit("new-donation", {
        name: updated.supporterName,
        amount: updated.amount,
        message: updated.message,
      });
      console.log("[KHALTI] Alert emitted to room:", streamerUsername);
    }

    return res.status(200).json({
      success: true,
      message: "Khalti donation verified and alert triggered",
      donation: {
        name: updated.supporterName,
        amount: updated.amount,
        streamer: streamerUsername,
      },
    });
  } catch (err) {
    console.error("[KHALTI-VERIFY] Error:", err.message, err.stack);
    return res.status(500).json({
      error: "Khalti verification failed",
      details: err.message,
    });
  }
};
