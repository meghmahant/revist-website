# Revist 2.0 — Public Marketing Website (`therevist.in`)

Customer retention automation website for independent restaurants and cafés, built with React, TypeScript, Vite, Tailwind CSS, Motion, and Recharts, plus a Google Sheets + Apps Script + Cloudflare Worker lead backend.

> **Deployment safety:** Active development lives on the `redesign/revist-2.0` branch. Do not merge into `main` or deploy to production (`https://therevist.in`) without explicit approval.

---

## Project Structure

- `src/config/siteConfig.ts` — Centralised public business configuration (reads `VITE_*` env vars; hides unconfigured contact links).
- `src/sections/` — Editorial sections: `Hero`, `CustomerStory`, `AutomationWorkflow`, `DashboardDemo` (fictional data), `WhatsAppSimulator` (no real messages sent), `RevenueCalculator`, `ProductFeatures`, `DataPrivacy`, `FAQ`, `FinalCTA`.
- `src/pages/` — `HomePage`, `PrivacyPolicyPage` (draft), `TermsOfServicePage` (draft).
- `src/components/forms/TrialModal.tsx` — Reusable free trial request modal with React Hook Form + Zod validation and verified JSON lead submission.
- `backend/google-apps-script/` — `Code.gs`, `appsscript.json`, and setup instructions for Google Sheets + MailApp notifications.
- `backend/serverless-proxy/` — Minimal Cloudflare Worker intermediary handling CORS, rate limiting, secret injection, and readable JSON responses.
- `public/CNAME` — Preserves custom domain `therevist.in` in GitHub Pages builds.
- `scripts/postbuild-routes.mjs` — Generates `/privacy-policy/index.html`, `/terms-of-service/index.html`, and `404.html` so direct legal URLs return HTTP 200 on GitHub Pages.

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables (optional for local preview)
Copy `.env.example` to `.env.local` and populate public values as confirmed:
```bash
cp .env.example .env.local
```
> **Security rule:** Never place private backend secrets (`SHARED_SECRET`, `SPREADSHEET_ID`) in `.env` or any `VITE_*` variable. Frontend Vite variables are compiled into the public bundle.

### 3. Start local dev server
```bash
npm run dev
```

### 4. Verify quality & build
```bash
npm run typecheck
npm run lint
npm test
npm run build
```

---

## Lead Backend & Google Sheets Setup

1. Create a private Google Sheet named **`Revist — Lead Management`** with a tab named **`Trial Leads`**.
2. Follow [`backend/google-apps-script/README.md`](backend/google-apps-script/README.md) to deploy `Code.gs`, configure `SPREADSHEET_ID`, `SHARED_SECRET`, `NOTIFICATION_EMAIL`, and `ENABLE_CUSTOMER_CONFIRMATION=false` in Apps Script **Script Properties**.
3. Deploy [`backend/serverless-proxy/cloudflare-worker.ts`](backend/serverless-proxy/cloudflare-worker.ts) via Wrangler with `APPS_SCRIPT_URL` and `SHARED_SECRET` stored as Worker secrets.
4. Set `VITE_LEAD_ENDPOINT` to your Cloudflare Worker URL in GitHub repository **Variables** (not Secrets, as it is a public endpoint URL).
5. Submit a test trial request from the modal and verify:
   - A new row appears in **`Trial Leads`** with `Lead ID`, server timestamp, `Lead status = New`, and `Notification status = SENT`.
   - An email arrives at `NOTIFICATION_EMAIL`.

---

## GitHub Pages Deployment

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs `typecheck`, `lint`, `test`, and `npm run build`, then uploads `./dist` (including `CNAME`, `robots.txt`, `sitemap.xml`, `privacy-policy/index.html`, and `terms-of-service/index.html`) to GitHub Pages when `main` is updated or manually dispatched.

---

## Pending Production Requirements Checklist

Before launching live on `https://therevist.in`, confirm and configure:
- [ ] Final business notification email (`NOTIFICATION_EMAIL`) & optional public email (`VITE_BUSINESS_EMAIL`)
- [ ] Public business contact phone number (`VITE_BUSINESS_PHONE`), if displayed
- [ ] Deployed Cloudflare Worker + Google Apps Script endpoint (`VITE_LEAD_ENDPOINT`)
- [ ] Legal review & approval of Draft Privacy Policy and Draft Terms of Service (including entity details, retention period, jurisdiction)
- [ ] Final confirmation of trial inclusions, WhatsApp message allowance/charges, and initial geographic target market
- [ ] Existing separate client dashboard URL (`VITE_CLIENT_DASHBOARD_URL`), if linked externally
