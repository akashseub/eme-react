# MongoDB backend setup

This version replaces the SQLite data access layer with Mongoose models and MongoDB queries. The React frontend and API paths remain unchanged.

## Local development

1. Install Node.js 22+ and MongoDB Community Server, or create a MongoDB Atlas database.
2. Start MongoDB locally, or obtain an Atlas connection string.
3. In `server`, copy `.env.example` to `.env` and set `MONGODB_URI` and a strong `ADMIN_PASSWORD`.
4. Run `cd server && npm install && npm run dev`.
5. In another terminal, run `npm install && npm run dev` at the project root.
6. Open http://localhost:5173 and sign in using `admin@eme.local` and your configured password.

## Important

- MongoDB starts with a new empty database; the previous SQLite records are **not automatically migrated**.
- Keep `DEMO_SEED=true` only to create the initial administrator. Turn it off in production.
- Uploaded document binaries are stored on the server filesystem under `server/uploads`; MongoDB stores their metadata. Use persistent disk or object storage when deploying.
- This implementation has passed JavaScript syntax checks but **has not been end-to-end tested against a running MongoDB instance** in this environment.
- Payment limit checks are not transactional; concurrent payment submissions should be guarded with a transaction before high-volume production use.
- Back up existing SQLite files before switching databases.
