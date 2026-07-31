# Kit API (Fastify) — microservicio fullstack demo

Servicio **standalone** en el monorepo Adolfo.

- **Sin `KIT_API_URL`:** UI Adolfo usa BFF Next + Postgres (Neon).
- **Con `KIT_API_URL`:** el BFF reenvía al Fastify publicado.

```bash
cd services/kit-api
npm install
npm run dev          # http://localhost:4001
```

Desde la raíz: `npm run dev:kit-api`

## Endpoints

| Método | Ruta | Notas |
|--------|------|--------|
| GET | `/health` | `{ ok, service }` |
| GET | `/api/kit/items` | Lista (store en memoria) |
| POST | `/api/kit/items` | `{ title }` |
| PATCH | `/api/kit/items/:id` | `{ title?, done? }` |
| DELETE | `/api/kit/items/:id` | |

## Deploy (Railway)

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub (`erickorso/adolfo`).
2. **Root Directory:** `services/kit-api`
3. Builder: Dockerfile (usa `railway.toml` + `Dockerfile` de esta carpeta).
4. Generate Domain → ej. `https://adolfo-kit-api-production.up.railway.app`
5. Probar: `GET /health`
6. En Vercel (proyecto Adolfo) agregá:
   ```
   KIT_API_URL=https://<tu-dominio-railway>
   KIT_CORS_ORIGINS=https://adolfo-nine.vercel.app
   ```
   (CORS en el Fastify ya incluye localhost + adolfo-nine; `KIT_CORS_ORIGINS` suma más.)

CLI (si tenés `railway` logueado):

```bash
cd services/kit-api
railway login
railway init
railway up
railway domain
```

## Variables

| Variable | Default | Descripción |
|----------|---------|-------------|
| `PORT` | — | Cloud (Railway/Fly) |
| `KIT_API_PORT` | `4001` | Local |
| `KIT_CORS_ORIGINS` | — | Orígenes extra CSV |
| `KIT_API_URL` | — | En **Next/Vercel**: base URL del Fastify |

## Notas

Store en **memoria**: reinicio = datos vacíos. Para persistencia real, conectar Neon en una siguiente iteración.
