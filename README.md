# Click 2 Clean (FixMyArea)

Click 2 Clean is the product name for the FixMyArea waste-reporting platform. The project includes a React interface and an Express API. The default local demo uses a JSON file store so citizen reports, admin assignments, and driver status updates are shared and persist between restarts without requiring a MySQL setup.

## Start locally

1. Run `npm install`.
2. Run `npm run dev`.
3. Open http://localhost:5173. This starts Vite and the local API together.

## Seed accounts

The local demo accounts use password `DemoPass123!`.

| Role | Email |
| --- | --- |
| Citizen | citizen@fixmyarea.local |
| Administrator | admin@fixmyarea.local |
| Driver | driver@fixmyarea.local |

Sign in with separate demo accounts to view citizen, administrator, and driver workflows. Reports and uploaded photos are stored under `backend/data` for this local demo. Do not use this demo server as a public production deployment.

## Optional MySQL backend

The original MySQL-backed API remains available with `npm run server:mysql`. Create a MySQL database, copy `backend/.env.example` to `backend/.env`, set database credentials and a unique JWT secret, then run `npm run db:migrate` and `npm run db:seed` before starting that server. The default `npm run dev` command uses the file-backed demo API instead.

## Environment

See backend/.env.example.

- DB_* configures MySQL.
- JWT_SECRET, JWT_EXPIRES_IN and COOKIE_SECURE configure secure sessions.
- CLOUDINARY_* enables Cloudinary. Without it, images are persisted under backend/uploads for a local demo.
- XAI_API_KEY and GROK_MODEL enable server-side Grok image assessment.
- OSRM_BASE_URL configures road-network routing.
- PYTHON_BIN chooses the Python interpreter for the OR-Tools adapter.
- SMS_PROVIDER_WEBHOOK_SECRET is required before using a real provider webhook.

Never commit backend/.env.

## SMS demonstration

Open /sms-simulator and submit phone 9876543210 with message REPORT Sector 15, Chandigarh.

The simulator posts to the real Express endpoint. The server validates the number and format, creates both an sms_records row and a waste_reports row inside one MySQL transaction, persists an administrator notification, and emits Socket.IO updates. It does not send a telecom SMS. Retrying a request with the same Idempotency-Key does not create another report.

## AI and routing

Citizen reports need a JPEG, PNG or WEBP photo no larger than 5 MB. The report persists before Grok analysis is attempted, so a failed or unavailable AI service cannot discard it. AI output is an unverified assessment stored in ai_analyses.

To enable routing, install the optimizer dependency with python -m pip install -r backend/requirements.txt. The route workflow accepts only verified reports with coordinates and an administrator-supplied planning weight. It calls OSRM for road costs and Google OR-Tools for capacity-constrained optimization. It does not show a fabricated fallback route.

## Core API

- Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- Reports: POST /api/reports, GET /api/reports, GET /api/reports/:id, PATCH /api/reports/:id/status
- AI: POST /api/ai/analyze/:reportId, GET /api/ai/analysis/:reportId
- SMS: POST /api/sms/incoming, GET /api/sms/history
- Admin: GET /api/admin/dashboard, PATCH /api/admin/reports/:id/verify
- Vehicles: GET and POST /api/vehicles
- Routes: POST /api/routes/optimize, GET /api/routes
- Notifications: GET /api/notifications, PATCH /api/notifications/:id/read

## Verification

| Requirement | Status |
| --- | --- |
| Express plus MySQL backend | Implemented; requires configured MySQL |
| JWT authentication and role checks | Implemented |
| React real API integration | Implemented for auth, reports, vehicles, notifications, SMS and routes |
| Real image upload | Implemented; Cloudinary awaits credentials |
| Grok integration | Implemented; awaits XAI_API_KEY and model access |
| WebSocket notifications | Implemented |
| Frontend and backend validation | Implemented |
| AppContext refactor | Implemented with React Query server state |
| Error boundaries | Implemented |
| React Query caching | Implemented |

Run npm run test:backend and npm run build. Database, Cloudinary, xAI, OSRM, and OR-Tools end-to-end checks require the corresponding external configuration.
