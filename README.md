# EME Inspection Services Ltd. — React + SQLite Backend

Working full-stack starter for a public landing page, quotation submissions, password-based login, project tracking, manual payment receipts, Super Admin approvals, daily updates and project document storage.

## Prerequisites

- Node.js **22.13+** (uses built-in `node:sqlite`)
- npm

## Install and run

Open **two terminals** from this repository.

### Terminal 1 — API + database

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

On Windows PowerShell, replace `cp .env.example .env` with `Copy-Item .env.example .env`.

Your SQLite database is created at `server/data/eme.sqlite` and uploaded documents are kept in `server/uploads/`.

### Terminal 2 — React frontend

```bash
npm install
npm run dev
```

Visit http://localhost:5173 . Vite forwards `/api` requests to http://localhost:4000 .

## Development login credentials

When `DEMO_SEED=true`, three user accounts are automatically created on first backend startup:

| Role | Email | Default password in `.env.example` |
|---|---|---|
| Super Admin | admin@eme.local | ChangeMeAdmin_123! |
| Marketing | marketing@eme.local | ChangeMeMarketing_123! |
| Engineering | engineering@eme.local | ChangeMeEngineering_123! |

Change all passwords **in `.env` before the first launch**. The seed creates only missing users; changing environment passwords does **not** reset existing accounts. This is a development bootstrap only. **Do not expose the seeded credentials on a public deployment.** Turn off `DEMO_SEED` for production.

## Features

- Public one-page site with the supplied EME logo
- Quote form writes to `quotes` in SQLite; staff can view submissions
- Password authentication with scrypt hashes, random database-backed session tokens, HttpOnly cookies and role checks
- Projects saved to SQLite; Marketing and Super Admin can create; engineering can update engineering activities
- Payment system with **no preset milestones**. Add amount, date and free-text remarks. Receipts start Pending, Super Admin alone can Confirm or Reject. Confirmed receipts alone count as confirmed revenue; total outstanding is contract amount minus confirmed receipts.
- Payment history is a separate table in project details and an all-project payment page
- Server-side document uploads (10 MB max/file) and authenticated downloads
- Daily work progress logs (Engineering/Marketing)

## Layout

```text
src/
  components/common/
  components/landing/
  components/layout/
  components/projects/PaymentEntryForm.jsx
  components/projects/PaymentHistoryTable.jsx
  pages/public/
  pages/admin/
  lib/api.js
  data/store.js
server/
  src/index.js              # HTTP endpoints and permissions
  src/db.js                 # SQLite schema, password utility
  data/                    # SQLite DB (not committed)
  uploads/                 # Stored project files (not committed)
  .env.example
```

## API overview

- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `POST /api/quotes` (public), `GET /api/quotes` (authenticated)
- `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/:id`
- `POST /api/projects/:id/payments`, `PATCH /api/payments/:paymentId` (Super Admin approval)
- `POST /api/projects/:id/updates`
- `POST /api/projects/:id/documents` (multipart file)
- `GET /api/documents/:id/download`

## Production readiness / cautions

This is a working **development starter**, not a certified production HRM platform. Before deployment, add migrations, automated integration tests, HTTPS, secured backups, credential management and password-reset/admin user management, deployment-specific CORS/CSRF protections, login rate limits, malware scanning for uploads, access control per assigned project if needed, audit logs, and monitoring. Confirmed receipts are immutable in this starter. Use a proper reversal workflow if a payment must be corrected. Restrict public signup (there is none). Never commit `.env`, the SQLite database, or confidential document files.


## Administration: Users & Roles

Sign in as Super Admin, then open **Admin Panel → Users & Roles**.

- **Users:** Create an Engineer or Marketing user with name, email, initial password (minimum 12 characters), and an assigned role. Edit their display name or role, or reset their password (existing sessions are revoked).
- **Roles & Permissions:** Create custom roles with module-level privileges; edit or delete custom roles. A role assigned to any user cannot be deleted until those users have been reassigned.
- **Default Roles:** Super Admin, Marketing, and Engineering are provided on first run. These built-in roles are read-only.
- **Security:** Only Super Admin may create users or roles and confirm payments. The server verifies privileges on each protected API action; hiding navigation links is not the sole security measure.

The database creates `roles`, `role_permissions`, and the `users.role_id` column automatically. Existing users are linked to their default roles on startup. No manual SQLite migration is necessary. Back up `server/data/eme.sqlite` before upgrading an existing deployment.

Custom roles use Engineering as their legacy team classification unless they are the built-in Marketing role. Team-restricted daily updates therefore use the Engineering team for custom roles; department/team assignment for custom roles can be extended in the next version.

### Editing roles

Sign in as Super Admin and open Users & Roles > Roles & Permissions. Click the pencil icon beside Marketing, Engineering, or any custom role. Edit the permission checkboxes and click Save Role. Default role names are locked; the Super Admin role is protected. Default role permission changes persist after backend restarts and take effect on subsequent authorized requests. Back up `server/data/eme.sqlite` before deployment or database changes.
