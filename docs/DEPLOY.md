# Deploy — Vercel + Neon

Guía para CI/CD completo: **GitHub Actions** (tests) → **deploy automático** a Vercel.

## Arquitectura

```text
PR / push
   │
   ▼
┌──────────┐     ┌─────┐     ┌─────────────────────┐
│ validate │ ──► │ e2e │ ──► │ deploy (solo push)  │
└──────────┘     └─────┘     └─────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
              main → production              develop → preview
```

| Rama | Deploy | Entorno GitHub |
|---|---|---|
| `main` | Vercel **Production** (`--prod`) | `production` |
| `develop` | Vercel **Preview** | `preview` |
| PR / `feature/*` | Solo CI (sin deploy) | — |

## 1. Neon (PostgreSQL)

1. [neon.tech](https://neon.tech) → proyecto → copiar **connection string** (pooler).
2. Migrar una vez desde local:

```bash
DATABASE_URL="postgresql://..." npm run db:deploy
DATABASE_URL="postgresql://..." npm run db:seed   # opcional
```

## 2. Vercel — proyecto

1. [vercel.com/new](https://vercel.com/new) → Import `erickorso/adolfo`.
2. **Storage → Blob** → Create → conectar al proyecto.
3. **Settings → Git** → desactivar **Automatic Deployments** (el deploy lo hace GitHub Actions tras CI verde).  
   - O dejar activo solo si preferís previews nativos en PRs; evitá doble deploy en `main`/`develop`.
4. **Settings → Environment Variables** (Production + Preview):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `SUPERADMIN_EMAILS` | tu email |
| `STORAGE_DRIVER` | `blob` |
| `EMAIL_PROVIDER` | `console` o `resend` |
| `EXCHANGE_RATE_TYPE` | `tarjeta` |
| `UALA_*` | Credenciales PROD (cuando quieras checkout real) |
| `GEMINI_API_KEY` | opcional |

> `AUTH_URL` no hace falta — se infiere de `VERCEL_URL`.

5. Obtener IDs para GitHub:

```bash
npx vercel login
npx vercel link
cat .vercel/project.json   # projectId + orgId
```

Token: [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create.

## 3. GitHub Secrets

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Origen |
|---|---|
| `VERCEL_TOKEN` | Token de Vercel |
| `VERCEL_ORG_ID` | `.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` → `projectId` |
| `DATABASE_URL` | Misma URL Neon (para `prisma migrate deploy` en CI antes del deploy) |

### Activar deploy automático

**Settings → Secrets and variables → Actions → Variables → New repository variable**

| Variable | Valor |
|---|---|
| `ENABLE_VERCEL_DEPLOY` | `true` |

Sin esta variable, CI corre `validate` + `e2e` pero **salta** los jobs de deploy (útil mientras configurás Vercel).

## 4. GitHub Environments (opcional)

**Settings → Environments** → crear `production` y `preview`.

En `production` podés exigir aprobación manual antes del deploy (recomendado en equipos).

## 5. Branch protection

Ver [`GIT-WORKFLOW.md`](./GIT-WORKFLOW.md). Checks requeridos:

- `validate`
- `e2e`
- `deploy-production` (solo en merge a `main`, post-merge)

## 6. Flujo

1. `feature/*` → PR → `develop` → CI verde → merge.
2. Push a `develop` → CI + **deploy preview**.
3. PR `develop` → `main` → merge.
4. Push a `main` → CI + **migrate** + **deploy production**.

## Troubleshooting

| Error | Solución |
|---|---|
| Deploy skipped | Faltan secrets `VERCEL_*` o el push no es a `main`/`develop` |
| Migrate failed | `DATABASE_URL` en GitHub Secrets incorrecta o IP allowlist en Neon |
| `STORAGE_DRIVER=local` | Setear `blob` + Blob store en Vercel |
| Doble deploy | Desactivar auto-deploy en Vercel Git settings |

## Build en Vercel

`vercel.json` ejecuta `prisma migrate deploy` antes del build como respaldo si el migrate en CI falló o se deploya manual desde Vercel CLI.
