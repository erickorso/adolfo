# Postman — Adolfo Nine API

Colección de todas las rutas `src/app/api/**`.

## Importar en Postman

1. **Import** → arrastrar o seleccionar:
   - `postman/adolfo-nine.postman_collection.json`
   - `postman/adolfo-nine.postman_environment.json` (prod) **o**
   - `postman/adolfo-nine.local.postman_environment.json` (localhost)
2. Activar el environment en el selector superior derecho.
3. Metrics: ejecutar **Get Token (POST)** → `metricsToken` se guarda solo → **Top Content**.

Formato: **Postman Collection v2.1.0** (`schema.getpostman.com/json/collection/v2.1.0/collection.json`).

## Variables

| Variable | Uso |
|----------|-----|
| `baseUrl` | `https://adolfo-nine.vercel.app` o `http://localhost:3000` |
| `metricsToken` | Auto-set tras get-token |
| `jobsIngestSecret` | Bearer para `/api/jobs/ingest` y `/api/rates/ingest` |
| `devLoginSecret` | Default `dev-local-secret` (solo dev) |
| `resumeId` | UUID del CV para `/api/resumes/:id/file` |

## Mantenimiento (obligatorio para agentes)

**Cada vez que se agregue, modifique o elimine un `src/app/api/**/route.ts`:**

1. Actualizar `postman/adolfo-nine.postman_collection.json` (request, método, body, auth, query).
2. Añadir variables nuevas a ambos environments si aplica.
3. Actualizar la tabla de rutas abajo.

## Rutas incluidas (2026-07-05)

| Método | Ruta | Auth |
|--------|------|------|
| POST, GET | `/api/metrics/get-token` | clientId + clientSecret |
| GET | `/api/metrics/top-content` | Bearer metricsToken |
| GET | `/api/auth/session` | cookie |
| GET | `/api/auth/csrf` | — |
| GET | `/api/auth/providers` | — |
| GET | `/api/catalog` | — |
| GET | `/api/images/catalog/*` | — |
| GET, POST | `/api/cart` | cookie |
| POST | `/api/cart/add` | cookie (form) |
| POST | `/api/cart/update` | cookie (form) |
| POST | `/api/cart/remove` | cookie (form) |
| POST | `/api/cart/clear` | cookie (form) |
| POST | `/api/checkout` | sesión + cookie |
| POST | `/api/webhooks/uala` | — |
| GET, POST | `/api/jobs/ingest` | Bearer |
| GET, POST | `/api/rates/ingest` | Bearer |
| GET | `/api/resumes/:id/file` | sesión |
| GET | `/api/dev/login` | secret (dev) |
| GET | `/api/dev/mock-uala-pay` | dev |

Auth.js catch-all (`/api/auth/signin`, `/api/auth/callback/*`, etc.) — usar **Dev Login** o UI web.
