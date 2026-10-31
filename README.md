# Click 2 Clean (FixMyArea)

Click 2 Clean is the product name for the FixMyArea waste-reporting platform. The project includes a React interface and an Express/MySQL API for reports, SMS ingestion, image upload, notifications, AI assessment, and road-network routing.

## Start locally

1. Create an empty MySQL database named fixmyarea.
2. Copy backend/.env.example to backend/.env and set DB values plus a unique JWT_SECRET.
3. Run npm install.
4. Run npm run db:migrate.
5. Run npm run db:seed.
6. In two terminals, run npm run server:dev and npm run dev.
7. Open http://localhost:5173.

## Seed accounts

All seeded accounts use password DemoPass123!.

| Role | Email |
| --- | --- |
| Citizen | citizen@fixmyarea.local |
| Administrator | admin@fixmyarea.local |
| Driver | driver@fixmyarea.local |

The frontend has no role switcher. Backend role checks protect every private API action.

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
