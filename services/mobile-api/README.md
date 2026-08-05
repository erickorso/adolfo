# Adolfo Mobile API (FastAPI)

BFF para **React Native / Flutter**. Misma Neon que Adolfo (tablas Prisma). Auth con JWT Bearer; jobs y courses en lectura.

```bash
cd services/mobile-api
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows
# source .venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
copy .env.example .env         # rellená DATABASE_URL + MOBILE_JWT_SECRET
# DATABASE_URL = la misma que en Adolfo (.env / Vercel)
uvicorn app.main:app --reload --port 4002
```

Docs: http://localhost:4002/docs · Health: http://localhost:4002/health

Desde la raíz del monorepo: `npm run dev:mobile-api`

## Endpoints

| Método | Ruta | Auth | Notas |
|--------|------|------|--------|
| GET | `/health` | — | `{ ok, service, version }` |
| POST | `/api/v1/auth/login` | — | `{ email, password }` → JWT |
| POST | `/api/v1/auth/register` | — | crea user (bcrypt, compatible web) |
| GET | `/api/v1/auth/me` | Bearer | perfil |
| GET | `/api/v1/me/scope` | Bearer | Preferencias de búsqueda del usuario |
| PUT | `/api/v1/me/scope` | Bearer | Upsert keywords + job/course query |
| GET | `/api/v1/coach/conversations` | Bearer | Listado de chats del user |
| POST | `/api/v1/coach/conversations` | Bearer | Nueva conversación (`?locale=`) |
| GET | `/api/v1/coach/conversations/{id}` | Bearer | Detalle + mensajes |
| DELETE | `/api/v1/coach/conversations/{id}` | Bearer | Borrar chat |
| POST | `/api/v1/coach/chat` | Bearer | Career Coach. Body: `conversation_id?`, `locale?`. Opcional `X-User-Gemini-Key`. Persiste mensajes. |
| GET | `/api/v1/jobs` | — | `q`, `keywords` (CSV scope), limit |
| POST | `/api/v1/jobs/ingest` | — | Proxy a Adolfo; body `{ keywords?, remote_only? }` |
| GET | `/api/v1/jobs/{id}` | — | detalle + description |
| GET | `/api/v1/courses` | — | `q`, `min_hours`, `location`, `modality` |
| GET | `/api/v1/courses/{id}` | — | detalle |

### Login ejemplo

```bash
curl -s -X POST http://localhost:4002/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"tu@email.com\",\"password\":\"...\"}"
```

```bash
curl -s http://localhost:4002/api/v1/auth/me -H "Authorization: Bearer <token>"
```

## Variables

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | sí | Postgres/Neon (mismo Adolfo) |
| `MOBILE_JWT_SECRET` | sí | secreto HS256 del BFF |
| `MOBILE_JWT_EXPIRE_MINUTES` | no | default 10080 (7d) |
| `MOBILE_API_PORT` | no | default 4002 |
| `MOBILE_CORS_ORIGINS` | no | CSV de orígenes |
| `ADOLFO_BASE_URL` | para ingest/AI | Next.js local/prod (default `http://127.0.0.1:3000`) |
| `JOBS_INGEST_SECRET` | para ingest/AI | Bearer Adolfo (ingest + AI si no hay AI_GENERATE_SECRET) |
| `GEMINI_MODEL` | BYOK | default `gemini-2.5-flash` (header `X-User-Gemini-Key`) |

## Producción: [Render](https://render.com)

Servicio: **https://adolfo-mobile-api.onrender.com**  
Dashboard: [dashboard.render.com](https://dashboard.render.com) · Web Service Docker · repo `erickorso/adolfo` · branch `main`

| Setting | Valor |
|---------|--------|
| Root Directory | `services/mobile-api` |
| Health Check Path | `/health` |
| Env | `DATABASE_URL`, `MOBILE_JWT_SECRET`, `ADOLFO_BASE_URL=https://adolfo-nine.vercel.app`, `JOBS_INGEST_SECRET` |

Health: [GET /health](https://adolfo-mobile-api.onrender.com/health) → `ingest_secret_configured: true`  
Free tier: cold start ~50s.

## Docker (local)

```bash
docker build -t adolfo-mobile-api .
docker run --env-file .env -p 4002:4002 adolfo-mobile-api
```

## Notas

- No usa cookies de Auth.js: token propio (`iss: adolfo-mobile-api`).
- Password hash compatible con `bcryptjs` de Next (misma columna `User.passwordHash`).
- Login/register devuelven `scope` y corren ingest con keywords del usuario (`ingest` / `ingest_error`).
- Coach: `POST /api/v1/coach/chat` arma contexto (scope + jobs + courses). Sin key de user → proxy Adolfo `/api/ai/generate`. Con `X-User-Gemini-Key` → Gemini directo (BYOK). Cuota Adolfo → `429` `{ code: AI_QUOTA }`.
- Jobs: filtros públicos (remote, no Madrid, keywords de scope o JS/FE, 10 días).
- `POST /api/v1/jobs/ingest` y Coach requieren Next corriendo + secret Bearer.
- No migra schema: solo lee/escribe tablas existentes (incl. `UserSearchScope`).
