# Revist Lead Collection Backend (Google Sheets + Apps Script + Cloudflare Worker)

## 1. Create the Private Google Sheet
1. Create a new Google Sheet named **`Revist — Lead Management`**.
2. Rename the primary tab to **`Trial Leads`** (keep the sheet private; never publish it to the web).
3. Copy the Spreadsheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`).

## 2. Deploy Google Apps Script
1. Open [script.google.com](https://script.google.com) and create a new project.
2. Copy `Code.gs` and `appsscript.json` into the project.
3. Open **Project Settings -> Script Properties** and add:
   - `SPREADSHEET_ID`: your private Google Sheet ID
   - `SHARED_SECRET`: a strong 32+ character random secret (never commit this to Git)
   - `NOTIFICATION_EMAIL`: the authorised Revist inbox address for trial notifications
   - `ENABLE_CUSTOMER_CONFIRMATION`: `false`
4. Click **Deploy -> New deployment -> Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone** (protected by `SHARED_SECRET` validated server-side in `doPost`)
5. Copy the Web App `/exec` URL.
6. Optional: Add an hourly time-driven trigger for `retryFailedNotifications` so transient `MailApp` quota failures retry automatically.

## 3. Deploy the Cloudflare Worker Proxy (`backend/serverless-proxy/`)
Google Apps Script Web Apps return `302` redirects that can cause browser CORS issues. Use the included Cloudflare Worker intermediary so the static frontend always receives verified, readable JSON responses.

```bash
cd backend/serverless-proxy
npx wrangler secret put APPS_SCRIPT_URL
npx wrangler secret put SHARED_SECRET
npx wrangler deploy
```

Set `ALLOWED_ORIGIN` in `wrangler.toml` to `https://therevist.in`. Then configure `VITE_LEAD_ENDPOINT` to the deployed Worker URL in your GitHub Actions repository variables (not secrets, since frontend Vite env vars are public).
