# EME deployment — Phase 1: Cloudflare Pages API proxy

This patch **does not** migrate SQLite to PostgreSQL or local uploads to
Supabase Storage. Do not deploy the current Express backend to Render for
persistent use until Phase 2 is finished. Render's free filesystem is ephemeral.

## Before starting

- Back up `server/data/eme.sqlite` and `server/uploads/` securely.
- Verify neither the database nor `.env` files are tracked by Git.
- Keep all Supabase database passwords and service-role keys on the server only.

## Cloudflare Pages setup

1. Connect the existing **private** GitHub repository using a Pages project.
2. Framework: **Vite**. Build command: `npm run build`. Output: `dist`.
3. Root directory: repository root.
4. Set a runtime environment variable in Pages **Settings → Variables and Secrets**:
   `API_ORIGIN=https://YOUR-RENDER-SERVICE.onrender.com`
   (no trailing slash). Redeploy after saving.
5. The Pages Function at `functions/api/[[path]].js` proxies requests from
   `https://YOUR-SITE.pages.dev/api/*` to your Render API. This keeps login
   cookies first-party, avoids browser cross-origin requests, and preserves the
   existing `fetch('/api/...')` calls in React.
6. Do not set `API_ORIGIN` to any URL you do not control.

## Render setup — only after Phase 2 database/storage migration

1. New Web Service → GitHub repository.
2. Root directory: `server`.
3. Build: `npm ci` (if you commit a server package-lock.json), otherwise `npm install`.
4. Start: `npm start`.
5. Set `NODE_ENV=production` and `ALLOWED_ORIGIN=https://YOUR-SITE.pages.dev`.
6. Set database connection and Supabase Storage secrets **after the Phase 2
   patch**; do not reuse the SQLite `DB_PATH` configuration in production.
7. Configure an initial Super Admin account using the Phase 2 bootstrap
   procedure. Never deploy with public demo credentials.
8. Keep `DEMO_SEED=false` unless Phase 2 explicitly documents an isolated
   administrator bootstrap process.

## Authentication and security

- The Render domain is publicly reachable. The Pages proxy is for browser
  same-origin authentication; it is **not** a firewall.
- The backend must enforce permissions and CSRF-origin checks.
- Test login/logout, project CRUD, roles, payment approval and file downloads
  before anyone enters real company data.
- A free hosting stack is suitable for trials, **not** a reliable production
  repository for confidential company documents or financial records.

## Local development

Local Vite still proxies `/api` to `http://localhost:4000` through
`vite.config.js`; the Cloudflare Function is only used by Pages deployment.
