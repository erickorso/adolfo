# Adolfo

Plataforma personal de producto: **catálogo / pagos**, **empleos**, **cursos**, **rutas de aprendizaje**, **sandbox** y **Career Coach**.  
Producción web: [adolfo-nine.vercel.app](https://adolfo-nine.vercel.app) · Autor: [Erick Vargas Ramos](https://github.com/erickorso)

| Superficie | Repo / ruta | URL |
|------------|-------------|-----|
| **Web** (Next.js) | este repo | [adolfo-nine.vercel.app](https://adolfo-nine.vercel.app) |
| **Mobile** (Expo) | [`erickorso/adolfo-mobile`](https://github.com/erickorso/adolfo-mobile) | Expo Go / web export |
| **BFF mobile** (FastAPI) | [`services/mobile-api`](./services/mobile-api) | [adolfo-mobile-api.onrender.com](https://adolfo-mobile-api.onrender.com) |

Misma base **PostgreSQL (Neon)** y usuarios compartidos (hash bcrypt compatible web ↔ mobile).

---

## Qué incluye (web)

| Área | Rutas / notas |
|------|----------------|
| Catálogo + checkout | `/catalog`, `/cart`, `/checkout` · Ualá Bis + webhooks |
| Empleos | `/jobs` · ingest Greenhouse/boards · CV + asistente Gemini |
| Cursos / FP | `/courses` · catálogo Neon |
| Learn | `/learn/*` · paths (AI agents, web perf, Python, motion, …) |
| Cuenta | pedidos, CVs, applications, cursos |
| Admin | catálogo, orders, jobs, users |
| Sandbox | `/sandbox/3d`, kit, streaming metrics |
| APIs públicas | `/apis` + Postman en `postman/` |

---

## Stack (web)

- **Next.js 16** (App Router, RSC, Server Actions) + **React 19**
- **TypeScript** strict · **Prisma 7** (`pg`) + **PostgreSQL**
- **Auth.js / NextAuth v5** (Credentials + Google opcional)
- **Ualá Bis** (checkout + webhook HMAC)
- **next-intl** (es / en) · **Zod 4** · **Zustand** (carrito)
- **Tailwind CSS v4** + `cva` / shadcn-style
- **Vitest + RTL + MSW** · **Playwright** E2E · **React Doctor** (pre-commit)
- **Gemini** (CV coach / AI generate)

## Familia de servicios

```text
adolfo/                          # este monorepo
├── src/                         # Next.js app
├── prisma/                      # schema compartido (web + BFF)
├── services/
│   ├── mobile-api/              # FastAPI BFF → mobile (JWT Bearer)
│   └── kit-api/                 # API auxiliar (kit sandbox)
├── backend/                     # metrics API (Node)
├── mfe-demo/                    # demos MFE
└── postman/                     # colección API

adolfo-mobile/                   # repo hermano Expo Router
```

| Comando | Servicio |
|---------|----------|
| `npm run dev` | Next.js `:3000` |
| `npm run dev:mobile-api` | BFF FastAPI `:4002` |
| `npm run dev:kit-api` | kit-api |
| `npm run dev:metrics-api` | backend metrics |
| `npm run mfe:dev` | mfe-demo |

Detalle BFF: [`services/mobile-api/README.md`](./services/mobile-api/README.md) · App móvil: [adolfo-mobile README](https://github.com/erickorso/adolfo-mobile).

---

## Arquitectura de estado (web)

| Dato | Dónde | Por qué |
|------|--------|---------|
| User / sesión | Auth.js (`auth()` / JWT) | Fuente de verdad en DB · no duplicar en stores |
| Carrito | Zustand + localStorage | Cliente efímero, sin login |
| UI trivial | React Context | No justifica store |
| Catálogo / pedidos / empleos | RSC / Server Actions | Estado de servidor |

## Estructura (web)

```text
prisma/                 schema + seed
src/
  app/                  App Router + API (webhooks, ingest, AI)
  components/           atoms → molecules → organisms → templates + ui/
  domain/               tipos, view models, Zod
  hooks/                useCart, useCurrency, …
  lib/                  env, prisma, money, auth, …
  services/             orders, catalog, jobs, resume, payments
  stores/               cart.store
e2e/                    Playwright
.github/workflows/      CI
```

## Flujo de checkout

1. Carrito → Server Action (`checkoutAction`).
2. Servidor re-valida precios/stock.
3. `Order` + `Payment` + reserva de stock (transacción Prisma).
4. Cobro Ualá Bis → redirect.
5. Webhook `POST /api/webhooks/uala` → impacto atómico (`PAID` / `CANCELLED`).

## Reglas de código

- Dinero **en centavos** (`src/lib/money.ts`).
- Estados de pedido/pago como **enums**.
- Webhook Ualá: JSON POST + ack 200.
- Sin estilos inline; handlers fuera del JSX.
- API nuevas en `src/app/api/**` → actualizar Postman (`postman/README.md`).

---

## Comandos

```bash
npm run dev            # Next
npm run dev:full       # mock Ualá + Next
npm run setup:dev      # .env + migrate + seed
npm run typecheck
npm run lint
npm test               # vitest
npm run test:e2e       # playwright
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run jobs:ingest    # ingest empleos local
npm run dev:mobile-api # BFF :4002
docker compose up -d   # Postgres local
```

## Setup rápido

1. Copiar `.env.example` → `.env`.
2. Postgres: `docker compose up -d` o Neon → `DATABASE_URL`.
3. `AUTH_SECRET` (`openssl rand -base64 32`). Opcional: Google OAuth, `SUPERADMIN_EMAILS`.
4. Ualá Bis (STAGE/PROD) — ver `.env.example` y [developers.ualabis.com.ar](https://developers.ualabis.com.ar/v2).  
   Local sin credenciales: `npm run dev:full`.  
   STAGE real + túnel: `npm run tunnel` + `node scripts/set-auth-url.mjs "<url>"`.
5. Opcional: `JOBS_*`, `GEMINI_API_KEY`, Resend, S3/R2/Blob.
6. `npm run db:migrate` && `npm run db:seed`.

## Deploy web (Vercel)

URL típica: `https://adolfo-nine.vercel.app` (detecta `VERCEL_URL` para callbacks).

1. Neon → `DATABASE_URL` → `npm run db:deploy` (+ seed opcional).
2. Vercel → env: `DATABASE_URL`, `AUTH_SECRET`, `STORAGE_DRIVER=blob`, Ualá PROD, `SUPERADMIN_EMAILS`, …
3. Guía completa: [`docs/DEPLOY.md`](./docs/DEPLOY.md).

| Push | Resultado |
|------|-----------|
| `main` | Production |
| `develop` | Preview |
| PR | Solo CI |

## Deploy BFF mobile (Render)

- **https://adolfo-mobile-api.onrender.com**
- Root: `services/mobile-api` · Docker · health `/health`
- Env: `DATABASE_URL`, `MOBILE_JWT_SECRET`, `ADOLFO_BASE_URL`, `JOBS_INGEST_SECRET`
- Free tier: **cold start ~50s**

## Git workflow

`main` · `develop` · `feature/*` — PRs con CI verde. Ver [`docs/GIT-WORKFLOW.md`](./docs/GIT-WORKFLOW.md).

## CI

Typecheck, lint, tests unitarios y build en cada push/PR. E2E opcional (Postgres + mock Ualá).

## License

MIT (código de producto / demos del autor).
