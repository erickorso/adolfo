# Catálogo — Productos y Servicios (MVP)

Plataforma de catálogo y ventas construida con estándar de código de producción.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions) + **React 19**
- **TypeScript** strict
- **Prisma 7** (driver adapter `pg`) + **PostgreSQL** (Supabase / Neon)
- **Auth0** (`@auth0/nextjs-auth0` v4)
- **Ualá Bis** para pagos
- **Zod 4** para validación de runtime + env tipado (`@t3-oss/env-nextjs`)
- **Zustand 5** para el carrito (estado de cliente)
- **Tailwind CSS v4** + `cva` (base estilo shadcn/ui)
- **Vitest + React Testing Library + MSW** (unit/component) y **Playwright** (E2E)

## Arquitectura de estado (regla clave)

| Dato | Dónde vive | Por qué |
|---|---|---|
| User / sesión | Auth0 (`useUser()` / sesión server) | Auth0 es la fuente de verdad. **No** se duplica en stores. |
| Carrito | Zustand + localStorage | Estado de cliente efímero, funciona sin login. |
| UI global trivial | React Context | No justifica un store. |
| Datos de catálogo/pedidos | Server Components / Server Actions | Estado de servidor; nada de `useEffect` + fetch. |

## Estructura de carpetas

```
prisma/
  schema.prisma          Modelos + enums (dinero en centavos, idempotencia)
  seed.ts                Datos de ejemplo (idempotente)
src/
  app/                   Rutas (App Router)
  components/
    atoms/               Price
    molecules/           ProductCard
    organisms/           (próximo: CartDrawer, Header)
    templates/           (próximo)
    ui/                  Primitivos (Button con cva)
  domain/schemas/        Esquemas Zod (cart, checkout, uala) — tipos vía z.infer
  hooks/                 useCart (hidratación del store)
  lib/                   env, prisma, money, utils (cn), auth0, webhook-signature
  services/              Lógica de negocio (users, payments/uala) — fuera de las rutas
  stores/                cart.store (Zustand)
  test/                  setup + mocks de MSW
e2e/                     Specs de Playwright
```

## Reglas de código aplicadas

- Dinero **siempre en centavos** (enteros) — ver `src/lib/money.ts`.
- Estados de pedido/pago como **enums**, nunca strings.
- Webhook de Ualá: **verificación de firma HMAC** + **clave de idempotencia** + impacto **atómico** en DB (`$transaction`).
- Sin estilos inline; sin lógica inline en JSX (handlers extraídos).
- Archivos chicos, una responsabilidad por módulo.

## Comandos

```bash
npm run dev            # servidor de desarrollo
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm test               # vitest (unit/component)
npm run test:e2e       # playwright (E2E)
npm run prisma:generate
npm run db:migrate     # prisma migrate dev (requiere DATABASE_URL)
npm run db:seed        # carga datos de ejemplo
```

## Setup pendiente (requiere credenciales)

1. Copiar `.env.example` a `.env` y completar las credenciales.
2. **Supabase / Neon**: crear el proyecto Postgres y pegar `DATABASE_URL`.
3. **Auth0**: crear la app, configurar callback `http://localhost:3000/auth/callback`
   y completar `AUTH0_*`. Generar `AUTH0_SECRET` con `openssl rand -hex 32`.
4. **Ualá Bis**: credenciales de sandbox (`UALA_*`) + secreto del webhook.
5. Correr `npm run db:migrate` y `npm run db:seed`.
