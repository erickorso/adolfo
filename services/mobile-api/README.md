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
| GET | `/api/v1/jobs` | — | listado público (remote, JS/FE, 10 días) |
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

## Docker / Railway

Root Directory: `services/mobile-api`. Set `DATABASE_URL` + `MOBILE_JWT_SECRET`.

```bash
docker build -t adolfo-mobile-api .
docker run --env-file .env -p 4002:4002 adolfo-mobile-api
```

## Notas

- No usa cookies de Auth.js: token propio (`iss: adolfo-mobile-api`).
- Password hash compatible con `bcryptjs` de Next (misma columna `User.passwordHash`).
- Jobs replica filtros públicos de Adolfo (remote, no Madrid, keywords JS/FE, ventana 10 días).
- No migra schema: solo lee/escribe tablas existentes.
