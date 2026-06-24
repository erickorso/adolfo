# Git workflow — Adolfo

Modelo **Git Flow lite** para un repo profesional: ramas claras, PRs con review y CI verde antes de merge.

## Ramas

| Rama | Propósito | Deploy |
|---|---|---|
| **`main`** | Producción estable. Solo entra vía PR desde `develop` o `hotfix/*`. | Vercel Production |
| **`develop`** | Integración continua. Base para el día a día. | Vercel Preview (opcional) |
| **`feature/*`** | Funcionalidad nueva | — |
| **`fix/*`** | Bug no urgente | — |
| **`hotfix/*`** | Fix urgente en producción | — |
| **`release/*`** | Preparar release (opcional) | — |

## Flujo diario

```text
develop ──► feature/mi-cambio ──► PR ──► develop ──► PR ──► main
                ▲                              │
                └──────── hotfix/xxx ──────────┘ (si es urgente desde main)
```

### 1. Nueva funcionalidad

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-corto

# … commits …

git push -u origin feature/nombre-corto
```

Abrí PR **`feature/…` → `develop`** en GitHub. Completá la plantilla de PR.

### 2. Release a producción

Cuando `develop` esté estable:

```bash
# PR en GitHub: develop → main
# Título sugerido: release: v0.2.0 — descripción breve
```

Merge solo con **CI verde**.

### 3. Hotfix en producción

```bash
git checkout main
git pull origin main
git checkout -b hotfix/descripcion-corta

# … fix …

git push -u origin hotfix/descripcion-corta
```

PR **`hotfix/…` → `main`**. Después cherry-pick o PR de `main` → `develop` para no perder el fix.

## Commits (Conventional Commits)

Formato: `tipo(alcance): descripción imperativa`

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Bug fix |
| `refactor` | Refactor sin cambio de comportamiento |
| `test` | Tests |
| `docs` | Documentación |
| `chore` | CI, deps, scripts |
| `style` | Formato (sin lógica) |

Ejemplos:

```text
feat(applications): pipeline de postulaciones en cuenta
fix(cart): sincronizar cookie al actualizar cantidad
docs(readme): sección deploy Vercel
```

## Pull requests

- **Una responsabilidad por PR** — preferir PRs chicos (< 400 líneas netas).
- **Título** = primer commit o resumen claro.
- **Descripción** = plantilla (`.github/pull_request_template.md`).
- **CI obligatorio** — no mergear con checks rojos.
- **Squash merge** recomendado en `feature → develop` (historial limpio).
- **Merge commit** opcional en `develop → main` (marca releases).

## Protección de ramas (GitHub)

Configurar en **Settings → Branches → Branch protection rules**:

### `main`

- [x] Require a pull request before merging
- [x] Require status checks to pass (`validate`, `e2e`)
- [x] Do not allow bypassing
- [ ] Require approvals: 1 (cuando haya más colaboradores)

### `develop`

- [x] Require a pull request before merging
- [x] Require status checks to pass (`validate`)
- [ ] Require approvals: 0–1 (solo o equipo)

## Comandos útiles

```bash
git fetch origin
git log --oneline develop..main          # qué falta en main
git log --oneline main..develop          # qué hay listo para release
git branch -d feature/nombre             # borrar rama local mergeada
```

## Referencias

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow vs Git Flow](https://docs.github.com/en/get-started/using-github/github-flow)
