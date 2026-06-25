# Lead Finder Pro

Find businesses by keyword + location, organize them into a working lead list, and reach out over WhatsApp — manually, message by message, with full control over what gets sent.

## What this is (and isn't)

This is a **real outreach organizer**, not an auto-messaging or scraping bot:

- Business data comes from the **Google Places API** (Text Search + Place Details), which is the legitimate, ToS-compliant way to programmatically retrieve public business listings. It is not a scraper — it's billed per request by Google and subject to their usage policies.
- **Nothing is ever sent automatically.** The WhatsApp button opens `wa.me` with a pre-filled message in a new tab/app. You review it, edit it if you like, and tap send yourself.
- A `mock` data provider is included so you can build/demo/test the entire app without a Google API key or any API spend. Swap providers with one environment variable.

You are responsible for using this in line with Google's Places API terms, WhatsApp's terms of service (in particular around unsolicited bulk messaging), and your local data-protection / anti-spam laws (e.g. India's IT Act / forthcoming DPDP rules, GDPR, CAN-SPAM-style regulations elsewhere). This tool gives you the data and the workflow; it does not give you legal cover for how you use it.

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS, Framer Motion, Recharts, React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT, bcrypt-hashed passwords, email-based password reset

## Project structure

```
lead-finder-pro/
├── server/              # Express API
│   ├── src/
│   │   ├── config/      # MongoDB connection
│   │   ├── controllers/ # Auth + leads business logic
│   │   ├── middleware/  # JWT auth guard, error handler
│   │   ├── models/      # User, Search, Lead (Mongoose schemas)
│   │   ├── routes/      # /api/auth, /api/leads
│   │   ├── services/    # Google Places provider, mock provider, email
│   │   └── utils/       # Token signing, demo seed script
│   └── .env.example
└── client/              # React app
    └── src/
        ├── api/         # Axios client + endpoint wrappers
        ├── components/  # Table, composer panel, layout, etc.
        ├── context/     # Auth + theme providers
        ├── pages/       # Login, Register, Dashboard, Search, Settings
        └── utils/       # Message template rendering, WhatsApp URL builder
```

## Setup

### 1. Prerequisites
- Node.js 18+
- A MongoDB instance — local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- (Optional, for real data) A Google Cloud project with **Places API** enabled and an API key

### 2. Backend

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, and either
# GOOGLE_PLACES_API_KEY (for real data) or LEAD_DATA_PROVIDER=mock (for demo data)
npm install
npm run dev
```

The API runs on `http://localhost:5000`. Health check: `GET /api/health`.

To create a demo login instantly instead of registering through the UI:
```bash
npm run seed
# creates demo@leadfinderpro.com / demo1234
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend automatically (see `vite.config.js`).

### 4. Getting a Google Places API key (for real search results)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/), create or select a project.
2. Enable **"Places API"** under APIs & Services.
3. Create an API key under Credentials, and restrict it (HTTP referrer or IP, and to the Places API) before using it anywhere outside local dev.
4. Paste it into `server/.env` as `GOOGLE_PLACES_API_KEY`, and set `LEAD_DATA_PROVIDER=google`.
5. Watch your usage in the Cloud Console — Text Search + Details calls are billed per request.

Without a key, set `LEAD_DATA_PROVIDER=mock` in `server/.env` to use realistic sample data and build/test the full app for free.

### 5. Password reset emails

`forgotPassword` uses SMTP via Nodemailer. If you don't configure `SMTP_*` in `.env`, the request still succeeds and the reset link is printed to the **server console** instead — handy for local development. Wire up a real SMTP provider (SendGrid, Mailgun, Gmail with an App Password, etc.) before going to production.

## Core features

| Feature | Where it lives |
|---|---|
| Keyword + location search | `SearchPage` → `POST /api/leads/search` → Google Places or mock provider |
| Results table with filters | `LeadsTable`, status pills + text filter in `SearchPage` |
| Multi-select | Checkbox column in `LeadsTable`, floating `SelectionBar` |
| WhatsApp composer (manual send) | `ComposerPanel` — builds a `wa.me` link, opens in a new tab, you tap send |
| Editable message template | Per-account default in `SettingsPage`, per-message override in `ComposerPanel` |
| Dashboard stats | `DashboardPage` — total / contacted / remaining, plus a progress donut |
| CSV / Excel export | `GET /api/leads/export/csv` and `/excel`, triggered from `SelectionBar` |
| Auth (login/register/forgot/reset) | `server/src/controllers/authController.js` + matching pages |
| Dark/light mode | `ThemeContext`, toggle in sidebar and Settings |

## Notes on the WhatsApp flow

The `wa.me` deep link format only supports pre-filling text into a *new, unstarted* chat — there is no official API for sending without the user's final tap, which is exactly the manual-review behavior this app is built around. Phone numbers are normalized to digits-only with country code for the link to work reliably.

## License

Built for your use — no attribution required.
