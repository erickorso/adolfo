# Kit API (Fastify) — microservicio fullstack demo

Servicio **standalone** en el monorepo Adolfo. En prod, el BFF de Next
(`src/app/api/kit/*` + Prisma/Neon) es la fuente de verdad visible en la UI.
Este proceso existe para practicar Node/Fastify/TS como microservicio real.

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

## UI

Sandbox Adolfo: `/sandbox/kit` (consume el BFF Next → Postgres).

Para pegarle directo al Fastify local: `KIT_API_URL=http://localhost:4001`.

## Variables

| Variable | Default |
|----------|---------|
| `KIT_API_PORT` | `4001` |
