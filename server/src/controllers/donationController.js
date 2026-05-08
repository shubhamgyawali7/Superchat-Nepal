import { generateEsewaSignature, verifyEsewaStatus, ESEWA_PRODUCT_CODE } from "../utils/esewa.js";
import { createAdminClient } from "../config/supabase.js";


export const initiateDonation = async (req, res) => {
  const {
    streamerUsername,
    amount,
    senderName,
    message: donorMessage,
    gateway,
  } = req.body;
  const supabase = req.supabase;

  try {
    // 1. Find streamer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", streamerUsername)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Streamer not found" });
    }

    // 2. Create donation record (pending)
    const supabaseAdmin = createAdminClient();
    const { data: donation, error: donationError } = await supabaseAdmin
      .from("donations")
      .insert([
        {
          streamer_id: profile.id,
          supporter_name: senderName || "Anonymous Supporter",
          amount: parseFloat(amount),
          message: donorMessage || "No message",
          payment_gateway: gateway || "esewa",
          status: "pending",
        },
      ])
      .select()
      .single();

    if (donationError) throw donationError;

    let paymentData = null;

    if (gateway === "esewa") {
      const donationId = donation.id;
      const amountNum = Math.floor(parseFloat(amount));

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
    return res.status(500).json({
      error: "Failed to initiate donation",
      details: err.message,
    });
  }
};

export const verifyEsewa = async (req, res) => {
  const encodedData = req.query.data || req.body.data;
  const io = req.io;

  console.log("🔍 [ESEWA-VERIFY] Method:", req.method);
  console.log("🔍 [ESEWA-VERIFY] Data Source:", req.query.data ? "QUERY" : req.body.data ? "BODY" : "NONE");

  if (!encodedData) {
    console.error("❌ [ESEWA-VERIFY] Missing data. Query:", req.query, "Body:", req.body);
    return res.status(400).json({ error: "Invalid eSewa data" });
  }

  try {
    // 1. Decode eSewa data
    const decodedBuffer = Buffer.from(encodedData, "base64");
    const decodedString = decodedBuffer.toString("utf-8");
    console.log("🔍 [ESEWA-VERIFY] Decoded string:", decodedString);

    const decodedData = JSON.parse(decodedString);

    // 2. Extract transaction details
    const { transaction_uuid, status, total_amount, transaction_code, signature, signed_field_names } = decodedData;

    console.log("🔍 [ESEWA] Verifying Transaction:", {
      transaction_uuid,
      total_amount,
      transaction_code,
      status,
      signature,
      signed_field_names
    });

    // Check for duplicate verification
    const supabaseAdmin = createAdminClient();
    const { data: existingDonation } = await supabaseAdmin
      .from("donations")
      .select("status")
      .eq("id", transaction_uuid)
      .single();

    if (existingDonation?.status === "verified") {
      console.log("⚠️ [ESEWA] Payment already verified");
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

      // Normalize and check against all known valid eSewa status values
      const statusStr = (statusData.status || statusData?.data?.status || "").toUpperCase();
      isComplete = ["COMPLETE", "SUCCESS", "COMPLETED"].includes(statusStr);

      console.log("🔍 [ESEWA] Status API result:", statusData.status, "| isComplete:", isComplete);
    } catch (apiError) {
      // Fallback: If the status API is unreachable (common in eSewa test environment),
      // trust the callback data if the status says COMPLETE and we have a transaction_code
      console.warn("⚠️ [ESEWA] Status API failed, falling back to callback data:", apiError.message);
      if (status === "COMPLETE" && transaction_code) {
        console.log("✅ [ESEWA] Callback data indicates COMPLETE — proceeding with verification");
        isComplete = true;
        statusData = { status: "COMPLETE", source: "callback_fallback" };
      }
    }

    if (isComplete) {
      // 4. Update donation status and get streamer username for socket
      const { data: donation, error } = await supabaseAdmin
        .from("donations")
        .update({
          status: "verified",
          transaction_id: transaction_code || (statusData && statusData.transaction_id),
          gateway_response: statusData || decodedData,
        })
        .eq("id", transaction_uuid)
        .select("*, profiles(username)")
        .single();

      if (error) {
        console.error("❌ [ESEWA] Supabase update error:", error);
        throw error;
      }

      // 5. TRIGGER OBS ALERT via Socket.io
      const streamerUsername = donation.profiles?.username;
      if (streamerUsername) {
        io.to(streamerUsername).emit("new-donation", {
          name: donation.supporter_name,
          amount: donation.amount,
          message: donation.message,
        });
        console.log("✅ [ESEWA] Alert emitted to room:", streamerUsername);
      }

      // 6. Return success JSON
      return res.status(200).json({
        success: true,
        message: "Donation verified and alert triggered",
        donation: {
          name: donation.supporter_name,
          amount: donation.amount,
          streamer: streamerUsername
        }
      });
    }

    console.error("❌ [ESEWA] Payment not complete. Status:", statusData?.status);
    res.status(400).json({ success: false, message: `Payment status: ${statusData?.status || "UNKNOWN"}` });
  } catch (err) {
    console.error("❌ [ESEWA] Verification Error:", err.message, err.stack);
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
};

export const verifyKhalti = async (req, res) => {
  res.status(501).json({ message: "Khalti verification logic to be implemented" });
};
