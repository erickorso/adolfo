# Catálogo — Productos y Servicios (MVP)

Plataforma de catálogo, ventas y empleos construida con estándar de código de producción.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19**
- **TypeScript** strict
- **Prisma 7** (driver adapter `pg`) + **PostgreSQL** (Supabase / Neon / Docker local)
- **Auth.js / NextAuth v5** (Credentials + Google OAuth opcional) — usuarios en nuestra DB
- **Ualá Bis** para pagos (checkout + webhook HMAC)
- **next-intl** (es / en)
- **Zod 4** para validación de runtime + env tipado (`@t3-oss/env-nextjs`)
- **Zustand 5** para el carrito (estado de cliente)
- **Tailwind CSS v4** + `cva` (base estilo shadcn/ui)
- **Vitest + React Testing Library + MSW** (unit/component) y **Playwright** (E2E)
- **Gemini** (asistente de CV para ofertas de empleo)

## Arquitectura de estado

| Dato | Dónde vive | Por qué |
|---|---|---|
| User / sesión | Auth.js (`auth()` / JWT) | Fuente de verdad en nuestra DB vía Prisma adapter. **No** se duplica en stores. |
| Carrito | Zustand + localStorage | Estado de cliente efímero, funciona sin login. |
| UI global trivial | React Context | No justifica un store. |
| Catálogo / pedidos / empleos | Server Components / Server Actions | Estado de servidor; nada de `useEffect` + fetch. |

## Estructura de carpetas

```
prisma/
  schema.prisma          Modelos + enums (dinero en centavos, idempotencia)
  seed.ts                Datos de ejemplo (idempotente)
src/
  app/                   Rutas (App Router) + API routes (webhooks, ingesta)
  components/
    atoms/               Price, QuantityStepper
    molecules/           CartLineItem, JobCard, …
    organisms/           CartPanel, SiteHeader, ResumeManager
    templates/           CatalogTemplate, JobsTemplate
    ui/                  Primitivos (Button, Card, …)
  domain/                Tipos de dominio, view models, esquemas Zod
  hooks/                 useCart, useCurrency, useRate
  lib/                   env, prisma, money, auth, webhook-signature
  services/              Lógica de negocio (orders, catalog, jobs, resume, payments)
  stores/                cart.store (Zustand)
  test/                  setup + mocks MSW
e2e/                     Specs de Playwright
.github/workflows/       CI (typecheck, lint, test, build)
```

## Flujo de checkout

1. El cliente envía el carrito vía Server Action (`checkoutAction`).
2. El servidor re-valida precios y stock contra la DB.
3. Se crea `Order` + `Payment` y se reserva stock (transacción Prisma).
4. Se crea el cobro en Ualá Bis y se redirige al comprador.
5. Ualá notifica vía `POST /api/webhooks/uala` (JSON plano; responder 200).
6. El webhook impacta el pedido de forma atómica (`PAID` / `CANCELLED`).

## Reglas de código

- Dinero **siempre en centavos** (enteros) — ver `src/lib/money.ts`.
- Estados de pedido/pago como **enums**, nunca strings sueltos.
- Webhook Ualá v2: **JSON POST** a `notification_url` + ack HTTP 200 + `$transaction`.
- Sin estilos inline; handlers extraídos del JSX.
- Archivos chicos, una responsabilidad por módulo.

## Comandos

```bash
npm run dev            # servidor de desarrollo
npm run dev:full       # mock Ualá + Next (checkout local sin credenciales reales)
npm run setup:dev      # completa .env + migrate + seed
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm test               # vitest (unit/component)
npm run test:e2e       # playwright (E2E)
npm run prisma:generate
npm run db:migrate     # prisma migrate dev (requiere DATABASE_URL)
npm run db:seed        # carga datos de ejemplo
docker compose up -d   # Postgres local
```

## Setup

1. Copiar `.env.example` a `.env` y completar las credenciales.
2. **Postgres**: `docker compose up -d` o Supabase/Neon → `DATABASE_URL`.
3. **Auth.js**: generar `AUTH_SECRET` con `openssl rand -base64 32`.
   - Opcional: `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET` para login con Google.
   - `SUPERADMIN_EMAILS`: emails promovidos a SUPERADMIN al loguearse.
4. **Ualá Bis v2** (checkout): credenciales del mail de bienvenida Ualá Bis.
   - **STAGE** (local):
     - Auth: `https://auth.stage.developers.ar.ua.la/v2/api/auth/token`
     - Checkout: `https://checkout.stage.developers.ar.ua.la/v2/api/checkout`
     - Credenciales del bloque "STAGE" del mail → `.env`
   - **PROD** (deploy):
     - Auth: `https://auth.developers.ar.ua.la/v2/api/auth/token`
     - Checkout: `https://checkout.developers.ar.ua.la/v2/api/checkout`
     - Credenciales productivas (`erick.max` + client id/secret prod)
   - STAGE: montos entre **$25 y $100 ARS** por transacción
   - Tarjeta de prueba: Visa `4507990000001026`, CVV `830`, exp `03/25`, titular `HOMOLOG DUAL LAPOS`
   - Webhook/callbacks: URL pública HTTPS (Ualá rechaza `localhost`)
   - **Local + Ualá STAGE real:**
     1. Terminal A: `npm run dev`
     2. Terminal B: `npm run tunnel` → copiá la URL `https://….trycloudflare.com`
     3. `node scripts/set-auth-url.mjs "https://….trycloudflare.com"` y reiniciá `npm run dev`
     4. Abrí la app **por la URL del túnel** (no `localhost:3000`)
   - Doc: https://developers.ualabis.com.ar/v2
   - Dev sin credenciales: `npm run dev:full` (mock en `:9999/v2/api` → simula webhook vía `/api/dev/mock-uala-pay`)
5. **Empleos** (opcional): `JOBS_GREENHOUSE_BOARDS`, `JOBS_INGEST_SECRET`.
6. **IA CV** (opcional): `GEMINI_API_KEY`.
7. **Email** (opcional): `EMAIL_PROVIDER=resend` + `RESEND_API_KEY` + `EMAIL_FROM`.
8. **Storage prod** (opcional): `STORAGE_DRIVER=s3` + credenciales `S3_*` (compatible R2).
9. Correr `npm run db:migrate` y `npm run db:seed`.

## Deploy (Vercel sin dominio propio)

Podés usar la URL gratuita `https://tu-proyecto.vercel.app` (HTTPS). **No hace falta comprar dominio** ni setear `AUTH_URL` manualmente: la app detecta `VERCEL_URL` automáticamente para Ualá callbacks y webhooks.

### 1. Base de datos (Neon — gratis)

1. [neon.tech](https://neon.tech) → crear proyecto → copiar connection string.
2. Migrar:

```bash
DATABASE_URL="postgresql://..." npm run db:deploy
DATABASE_URL="postgresql://..." npm run db:seed   # catálogo demo (opcional)
```

### 2. Vercel

1. [vercel.com](https://vercel.com) → Import Git repo.
2. **Storage** → Create → **Blob** (private) → conectar al proyecto (`BLOB_READ_WRITE_TOKEN` se agrega solo).
3. **Environment Variables** (Production):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | Connection string Neon (pooler) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `STORAGE_DRIVER` | `blob` |
| `UALA_AUTH_URL` | `https://auth.developers.ar.ua.la/v2/api` |
| `UALA_CHECKOUT_URL` | `https://checkout.developers.ar.ua.la/v2/api` |
| `UALA_USERNAME` | `erick.max` |
| `UALA_CLIENT_ID` | credencial PROD |
| `UALA_CLIENT_SECRET_ID` | credencial PROD |
| `SUPERADMIN_EMAILS` | tu email |
| `EMAIL_PROVIDER` | `console` (dev) o `resend` + keys |

> `AUTH_URL` **opcional** — si no la seteás, usa `https://<proyecto>.vercel.app`.

4. Deploy. Anotá la URL: `https://xxxx.vercel.app`.

### 3. Post-deploy (100% operativo)

1. Registrate / login con el email de `SUPERADMIN_EMAILS`.
2. `/admin/catalog` → productos reales (o usá los del seed).
3. Compra de prueba con tarjeta real (PROD, monto bajo) → verificá `/account/orders` = **Pagado**.
4. Webhook Ualá: `https://xxxx.vercel.app/api/webhooks/uala` (HTTPS público, sin config extra).

### CLI (alternativa)

```bash
npx vercel login
npx vercel link
npx vercel env add DATABASE_URL
# ... resto de variables
npx vercel --prod
```

### Crons (opcional)

`vercel.json` incluye ingesta de cotización (diaria) y empleos (lunes). Requieren `JOBS_INGEST_SECRET` + `CRON_SECRET` + boards configurados.

## CI

Cada push/PR ejecuta typecheck, lint, tests unitarios y build. Job E2E opcional con Postgres + mock de Ualá (`.github/workflows/ci.yml`).
