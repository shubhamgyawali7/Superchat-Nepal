# SuperChat Nepal 🇳🇵

> The #1 real-time donation & superchat platform built exclusively for the Nepali streaming community.

SuperChat Nepal enables Nepali streamers to receive live donations from supporters using **local payment gateways** (eSewa, Khalti) and display **instant OBS overlay alerts** during their livestreams. Think of it as a Nepali alternative to Streamlabs or StreamElements — but powered by eSewa & Khalti instead of PayPal or Stripe.

---

## 📖 Table of Contents

- [What is This Project?](#-what-is-this-project)
- [Who is it For?](#-who-is-it-for)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture Overview](#️-architecture-overview)
- [Project Structure](#-project-structure)
- [Data Flow](#-data-flow)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#️-database-schema)
- [Security](#-security)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 What is This Project?

SuperChat Nepal solves a real problem: **Nepali streamers have no local platform to receive donations during livestreams.** International platforms like Streamlabs don't support Nepali payment methods (eSewa, Khalti, ConnectIPS), so streamers either miss out on donations or rely on manual bank transfers.

This platform provides:

1. **A public donation page** (`/donate/:username`) — Supporters visit this link, pick an amount, write a message, and pay via eSewa or Khalti.
2. **A streamer dashboard** (`/dashboard`) — Streamers manage their profile, view donation history, customize alerts, and monitor earnings.
3. **An OBS overlay** (`/overlay/:userId`) — A transparent browser-source page that streamers add to OBS Studio. When a donation arrives, an animated alert with the supporter's name, amount, and message pops up on the livestream in real-time.

---

## 👥 Who is it For?

| User Type | What They Do |
|---|---|
| **Streamers** | Register, set up their profile, copy their donation link & OBS overlay URL, then go live. |
| **Supporters / Viewers** | Visit a streamer's donation link, enter a name + message + amount, pay with eSewa or Khalti. |

---

## 🚀 Key Features

- **🇳🇵 Local Payment Gateways** — eSewa (fully integrated) and Khalti (ready for integration) support.
- **⚡ Real-time OBS Alerts** — Sub-second donation notifications via Socket.io pushed directly to the streamer's OBS overlay.
- **📊 Streamer Dashboard** — View total earnings, recent donations, unique supporter count, and donation history.
- **⚙️ Profile Settings** — Customize display name, bio, avatar, theme color, welcome text, social links, and alert preferences.
- **🎨 Overlay Customization** — Configure minimum alert amount, alert duration, and theme color.
- **🧪 Test Alerts** — Send a test donation alert to verify OBS overlay is working before going live.
- **🔐 Secure Authentication** — Email-based signup with Supabase Auth (PKCE flow) and server-side session cookies.
- **🛡️ Server-Side Payment Verification** — Payments are verified server-to-server with eSewa's API; never trusted from the client.

---

## 🛠️ Tech Stack

### Frontend (Client)

| Technology | Purpose |
|---|---|
| **Next.js** (App Router) | React framework with SSR, file-based routing |
| **Tailwind CSS** | Utility-first styling |
| **Socket.io Client** | Real-time WebSocket connection for live alerts |
| **Supabase Client** | Authentication & data fetching |
| **Zustand** | Lightweight global state management (alert store) |
| **Lucide React** | Icon library |

### Backend (Server)

| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Socket.io** | WebSocket server for real-time donation events |
| **Supabase (PostgreSQL)** | Database, authentication, and Row Level Security |
| **HMAC-SHA256 (crypto)** | eSewa payment signature generation & verification |
| **dotenv** | Environment variable management |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPPORTER (Browser)                      │
│  Visits /donate/:username → Fills form → Pays via eSewa/Khalti │
└─────────────┬───────────────────────────────────────────────────┘
              │  POST /api/donations/initiate
              ▼
┌─────────────────────────────┐     ┌──────────────────────────┐
│     EXPRESS SERVER          │◄───►│    SUPABASE (PostgreSQL)  │
│                             │     │                          │
│  • Auth routes              │     │  • profiles table        │
│  • Donation routes          │     │  • donations table       │
│  • Streamer routes          │     │  • Auth (PKCE + cookies) │
│  • Socket.io server         │     │  • Row Level Security    │
│  • eSewa signature/verify   │     └──────────────────────────┘
└──────┬──────────────────────┘
       │  Socket.io: "new-donation" event
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OBS OVERLAY (Browser Source)                 │
│  /overlay/:userId — Listens for donations → Shows animated alert│
└─────────────────────────────────────────────────────────────────┘
```

The application uses a **decoupled client-server architecture**:
- **Client** (Next.js) handles UI, authentication pages, and the donation form.
- **Server** (Express) handles business logic, payment signing, verification, and real-time Socket.io events.
- **Supabase** acts as the database and auth provider.
- **Socket.io** bridges the server and the OBS overlay for instant alerts.

---

## 📂 Project Structure

```
superchat/
├── client/                          # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── page.js              # Landing page (hero, features)
│       │   ├── layout.js            # Root layout
│       │   ├── globals.css          # Global styles
│       │   ├── login/               # Login page
│       │   ├── register/            # Registration page
│       │   ├── (auth)/              # Auth route group
│       │   ├── dashboard/
│       │   │   ├── page.js          # Dashboard home (stats overview)
│       │   │   ├── DashboardClient.js  # Client component with real-time data
│       │   │   ├── layout.js        # Dashboard layout with sidebar
│       │   │   ├── settings/        # Profile settings page
│       │   │   ├── history/         # Donation history page
│       │   │   └── customize/       # Overlay customization page
│       │   ├── donate/
│       │   │   ├── [username]/      # Public donation page
│       │   │   │   ├── page.js      # Fetches streamer profile
│       │   │   │   └── DonationForm.js  # The donation form component
│       │   │   ├── success/         # Payment success callback page
│       │   │   └── error/           # Payment error page
│       │   └── overlay/
│       │       └── [userId]/        # OBS browser source overlay
│       │           └── page.js      # Listens for Socket.io alerts
│       ├── components/
│       │   └── dashboard/
│       │       └── Sidebar.jsx      # Dashboard sidebar navigation
│       ├── hooks/
│       │   ├── useAuth.js           # Auth session management hook
│       │   ├── useSocket.js         # Socket.io connection hook
│       │   └── useAlertStore;.js    # Alert state management hook
│       ├── lib/
│       │   ├── esewa.js             # eSewa payment initiation helpers
│       │   ├── khalti.js            # Khalti payment helpers
│       │   ├── supabase.js          # Supabase client setup
│       │   └── utils.js             # General utilities
│       ├── store/
│       │   └── alertStore.js        # Zustand store for alert state
│       ├── utils/
│       │   └── supabase/            # Supabase SSR utilities
│       └── middleware.js            # Next.js middleware (auth redirects)
│
├── server/                          # Express.js backend
│   └── src/
│       ├── app.js                   # Entry point: Express + Socket.io setup
│       ├── config/
│       │   └── supabase.js          # Supabase client (SSR + Admin)
│       ├── controllers/
│       │   ├── authController.js    # Register, login, logout, callback
│       │   ├── donationController.js # Initiate & verify donations
│       │   └── streamerController.js # Profile, dashboard, test alerts
│       ├── middleware/
│       │   └── authMiddleware.js    # JWT auth via Supabase cookies
│       ├── models/
│       │   └── Users.js             # User model reference
│       ├── routes/
│       │   ├── auth.js              # /api/auth/* routes
│       │   ├── donation.js          # /api/donations/* routes
│       │   └── streamer.js          # /api/streamer/* routes
│       ├── services/
│       │   └── authService.js       # Auth service helpers
│       └── utils/
│           └── esewa.js             # HMAC signature & status verification
│
├── PROJECT_OVERVIEW.md              # Technical overview document
├── ESEWA_INTEGRATION_FLOW.txt       # Detailed eSewa integration guide
├── SETUP.md                         # Setup instructions
└── README.md                        # This file
```

---

## 🔄 Data Flow

### 1. Authentication Flow

```
User (Browser)                    Server                      Supabase
     │                              │                            │
     │── POST /api/auth/register ──►│── signUp() ───────────────►│
     │◄── "Check your email" ──────│◄── confirmation email ─────│
     │                              │                            │
     │── clicks email link ────────►│── GET /api/auth/callback ─►│
     │   (with ?code=...)           │── exchangeCodeForSession() │
     │◄── redirect to /dashboard ──│◄── session cookies set ────│
     │                              │                            │
     │── POST /api/auth/login ────►│── signInWithPassword() ───►│
     │◄── session + user data ─────│◄── JWT + user ─────────────│
```

- Users register with **email + password + username**.
- Supabase sends a **verification email** with a PKCE code.
- Clicking the link hits the server's `/api/auth/callback`, which exchanges the code for a session.
- Sessions are stored as **HTTP-only cookies** (via `@supabase/ssr`), not localStorage.

### 2. Donation & Alert Lifecycle (Core Flow)

This is the **heart of the application** — the complete journey from a supporter clicking "Send Superchat" to the alert appearing on a livestream:

```
Step 1: INITIATION
Supporter ── fills form on /donate/:username
           ── clicks "Send Superchat"
           ── Frontend POSTs to /api/donations/initiate
              { streamerUsername, amount, senderName, message, gateway: "esewa" }

Step 2: SERVER PROCESSING
Server ── looks up streamer in `profiles` table
       ── creates a PENDING record in `donations` table
       ── generates HMAC-SHA256 signature using ESEWA_SECRET_KEY
          Message format: "total_amount={amt},transaction_uuid={id},product_code={code}"
       ── returns paymentData (signature, form URL, params) to frontend

Step 3: PAYMENT REDIRECT
Frontend ── dynamically creates a hidden <form> with all eSewa fields
         ── auto-submits the form to eSewa's payment portal
         ── user completes payment on eSewa's website

Step 4: CALLBACK
eSewa ── redirects user to /donate/success?data={base64_encoded_payload}
      ── the success page sends encoded data to server

Step 5: VERIFICATION
Server ── decodes the Base64 payload from eSewa
       ── calls eSewa Status API (server-to-server) to confirm payment
       ── updates donation status to "verified" in Supabase
       ── increments streamer's total_earnings

Step 6: REAL-TIME ALERT
Server ── emits Socket.io event: io.to(streamer_username).emit("new-donation", {
            name: "Supporter Name",
            amount: 500,
            message: "Great stream!"
          })

Step 7: OBS OVERLAY
Overlay page ── receives "new-donation" event via Socket.io
             ── triggers animated alert with name, amount, and message
             ── alert appears on the livestream for viewers to see
```

### 3. OBS Overlay Connection Flow

```
Streamer adds Browser Source in OBS
    URL: https://yourdomain.com/overlay/{userId}
         │
         ├── Page loads → connects to Socket.io server
         ├── Emits "join-streamer" with username
         ├── Server adds socket to username-specific room
         │
         └── Waits for "new-donation" events
              └── On event → renders animated alert → auto-hides after duration
```

### 4. Dashboard Data Flow

```
Streamer visits /dashboard
    │
    ├── useAuth hook checks Supabase session
    ├── If authenticated → GET /api/streamer/dashboard (with auth cookie)
    │   Server returns: { username, displayName, totalEarnings, recentDonations, supporterCount }
    │
    ├── /dashboard/settings → GET profile → PUT /api/streamer/profile (update)
    ├── /dashboard/history → lists all past donations with status
    └── /dashboard/customize → configure overlay appearance
```

---

## 📡 API Endpoints

### Auth Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Create account (email, password, username) |
| `POST` | `/login` | ❌ | Login with email & password |
| `GET` | `/callback` | ❌ | Email verification callback (PKCE code exchange) |
| `POST` | `/logout` | ✅ | Destroy session |

### Donation Routes (`/api/donations`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/initiate` | ❌ | Create pending donation & get eSewa payment data |
| `POST` | `/verify-esewa` | ❌ | Verify eSewa payment & trigger OBS alert |
| `POST` | `/verify-khalti` | ❌ | Verify Khalti payment (not yet implemented) |

### Streamer Routes (`/api/streamer`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/profile/:username` | ❌ | Get public profile for donation page |
| `GET` | `/dashboard` | ✅ | Get dashboard stats (earnings, donations, supporters) |
| `PUT` | `/profile` | ✅ | Update profile settings |
| `POST` | `/test-alert` | ✅ | Send a test donation alert to OBS overlay |

### Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join-streamer` | Client → Server | OBS overlay joins a streamer-specific room |
| `new-donation` | Server → Client | Donation alert pushed to overlay |

---

## 🗄️ Database Schema

The app uses **Supabase (PostgreSQL)** with two core tables:

### `profiles` Table

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Links to Supabase Auth user ID |
| `username` | TEXT (unique) | Public-facing username (used in URLs) |
| `display_name` | TEXT | Display name shown on donation page |
| `bio` | TEXT | Short bio/description |
| `avatar_url` | TEXT | Profile picture URL |
| `theme_color` | TEXT | Hex color for donation page & alerts |
| `welcome_title` | TEXT | Custom title on donation page |
| `welcome_sub` | TEXT | Custom subtitle on donation page |
| `youtube_url` | TEXT | YouTube channel link |
| `facebook_url` | TEXT | Facebook page link |
| `upi_id` | TEXT | Payment identifier |
| `total_earnings` | NUMERIC | Cumulative verified donation total |
| `alert_min_amount` | NUMERIC | Minimum amount to trigger OBS alert |
| `alert_duration` | INTEGER | How long the alert stays on screen (ms) |

### `donations` Table

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Donation ID (also used as eSewa `transaction_uuid`) |
| `streamer_id` | UUID (FK) | References `profiles.id` |
| `supporter_name` | TEXT | Name entered by the supporter |
| `amount` | NUMERIC | Donation amount in NPR |
| `message` | TEXT | Message from supporter |
| `payment_gateway` | TEXT | `"esewa"` or `"khalti"` |
| `status` | TEXT | `"pending"` → `"verified"` or `"failed"` |
| `transaction_id` | TEXT | Gateway transaction code |
| `gateway_response` | JSONB | Raw response from payment gateway |
| `created_at` | TIMESTAMP | When the donation was initiated |

---

## 🔐 Security

| Measure | Implementation |
|---|---|
| **Secret Key Protection** | `ESEWA_SECRET_KEY` never leaves the server. Signatures are generated server-side only. |
| **Server-to-Server Verification** | Payments are verified by calling eSewa's Status API directly from the backend, not trusting client-side redirects. |
| **Duplicate Prevention** | Before processing, the server checks if a donation has already been verified to prevent double-processing. |
| **Supabase SSR Auth** | Sessions use HTTP-only cookies via `@supabase/ssr` — no tokens in localStorage. |
| **Auth Middleware** | Protected routes use `authMiddleware.js` which validates the session cookie with Supabase before proceeding. |
| **Socket Room Scoping** | Each streamer joins a private Socket.io room by username; alerts are emitted only to that room. |
| **Admin Client for RLS Bypass** | Donation records are created/updated using `supabaseAdmin` (service role key) so that unauthenticated supporters can still trigger donations without bypassing RLS on other tables. |
| **HMAC-SHA256 Signing** | eSewa payment forms are signed with HMAC-SHA256 to prevent tampering with amount or transaction ID. |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** or **yarn**
- **Supabase** account with a project set up
- **eSewa Merchant Account** (test credentials available at [eSewa Developer Portal](https://developer.esewa.com.np))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/superchat.git
cd superchat
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5000
ESEWA_SECRET_KEY=your_esewa_secret_key
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_FORM_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form
ESEWA_API_URL=https://rc-epay.esewa.com.np/api/epay
```

Start the server:

```bash
npm run dev
```

### 3. Setup the Client

```bash
cd ../client
npm install
```

Create a `.env.local` file in the `client/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

### 4. Setup the Database

In your Supabase dashboard, create the following tables:

1. **`profiles`** — with columns as described in the [Database Schema](#️-database-schema) section. Enable RLS and add policies for authenticated users to read/update their own rows.
2. **`donations`** — with columns as described above. Configure RLS so streamers can read their own donations.

> **Tip:** Create a database trigger to auto-create a `profiles` row when a new user signs up via Supabase Auth.

### 5. Test the Full Flow

1. Register a streamer account at `http://localhost:3000/register`
2. Verify your email and log in
3. Go to Dashboard → copy your donation link (`/donate/your-username`)
4. Add OBS browser source with your overlay URL (`/overlay/your-user-id`)
5. Open the donation link in another browser/tab and send a test donation
6. Watch the alert appear in OBS! 🎉

---

## 🔧 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (default: `5000`) |
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (admin access) |
| `CLIENT_URL` | ✅ | Frontend URL for CORS & redirects |
| `SERVER_URL` | ✅ | Server URL for auth callback redirect |
| `ESEWA_SECRET_KEY` | ✅ | eSewa merchant secret key |
| `ESEWA_PRODUCT_CODE` | ✅ | eSewa product/merchant code |
| `ESEWA_FORM_URL` | ❌ | eSewa form submission URL (defaults to test) |
| `ESEWA_API_URL` | ❌ | eSewa API base URL (defaults to test) |

### Client (`client/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Backend server URL |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">Built with ❤️ for the Nepali Gaming & Streaming Community</p>
