# Metrics API (Express)

Servicio **standalone** — mismo contrato que `src/app/api/metrics/*` en Next.js.

No se levanta con `npm run dev` del frontend. Arranque manual:

```bash
cd backend
npm install
npm run dev          # puerto 4000, hot reload
```

## Endpoints

| Método | Ruta | Auth |
|--------|------|------|
| `POST` | `/api/metrics/get-token` | — |
| `GET` | `/api/metrics/get-token?clientId=&clientSecret=` | — |
| `GET` | `/api/metrics/top-content` | `Authorization: Bearer` |
| `GET` | `/health` | — |

Credenciales demo: `metrics-demo` / `metrics-demo-dev`

## curl

```bash
# Token
curl "http://localhost:4000/api/metrics/get-token?clientId=metrics-demo&clientSecret=metrics-demo-dev"

# Top content
curl "http://localhost:4000/api/metrics/top-content?from=2026-06-01&to=2026-06-30&limit=5&country=ES" \
  -H "Authorization: Bearer <token>"
```

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `METRICS_API_PORT` | `4000` | Puerto HTTP |
| `METRICS_SANDBOX_ENABLED` | activo | `false` → 404 en todas las rutas metrics |
| `METRICS_SANDBOX_SECRET` | `AUTH_SECRET` | Firma HMAC del token |
| `METRICS_SANDBOX_CLIENT_SECRET` | `metrics-demo-dev` | Secret del client demo |
| `AUTH_SECRET` | dev fallback | Mismo secret que Next → tokens intercambiables |

## Arquitectura

```
backend/src/
  index.ts              # entry
  app.ts                # express + middleware JSON
  config/env.ts
  routes/metrics.ts     # handlers HTTP
  middleware/           # sandbox gate + Bearer
  lib/metrics-auth.ts   # tokens (compatible con Next)
  lib/playback-events.ts
  domain/streaming-metrics/   # espejo de src/domain/…
```

Dataset: lee `../src/data/streaming/playback-events.json` (única fuente).

## Postman

Duplicá la collection de `postman/` cambiando `baseUrl` a `http://localhost:4000`.

## Próximo paso (opcional)

- `npm run dev:full` que levante Next + Express en paralelo
- Proxy en Next: `/api/metrics/*` → `localhost:4000` en dev
- Tests Vitest en `backend/` reutilizando fixtures del dominio Next
