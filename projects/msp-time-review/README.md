# MSP Time Review

Demo SaaS multi-tenant — **Drizzle + NextAuth** (auth igual que Adolfo; ORM distinto para practicar Verve IT).

**Prisma** → Adolfo · **Better Auth** → solo si hace falta más adelante.

Inspirado en [Verve IT · Full-Stack](https://www.getonbrd.com/jobs/programming/mid-level-full-stack-developer-verve-it-remote): Next.js, Postgres, Stripe, mock ConnectWise e **IA dual** (Python + Java).

**Plan completo:** [`../../jobs/verve-it-mastery-plan.md`](../../jobs/verve-it-mastery-plan.md)

## Estado

| Fase | Estado |
|---|---|
| 0 Setup | 🔲 Pendiente |
| 1 Auth multi-tenant | 🔲 |
| 2 Time entries | 🔲 |
| 3 Stripe | 🔲 |
| 4 IA Python | 🔲 |
| 5 IA Java | 🔲 |
| 6 Producción | 🔲 |

## Stack objetivo

- **Web:** Next.js 16 · TypeScript · Vercel
- **DB:** PostgreSQL · Drizzle ORM
- **Auth:** NextAuth (Google SSO · multi-tenant vía `organizationId`)
- **Payments:** Stripe
- **IA:** FastAPI (Python) + Spring Boot (Java) — mismo contrato OpenAPI
