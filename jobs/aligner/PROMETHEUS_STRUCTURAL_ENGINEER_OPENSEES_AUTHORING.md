# Alignerr Prometheus Production OpenSees RL Task Guide for Structural Engineers

> Fuente: guía Alignerr / Labelbox — Prometheus Production (structures / OpenSees)  
> Guardado: 2026-07-15 · Carpeta: `jobs/aligner/`  
> Uso: referencia local para revisar y/o authoring de tasks RL.  

Esta guía es para structural engineers que quieren crear Alignerr tasks alrededor de OpenSees, structural analysis, retrofit design, o simulation-driven engineering judgment.

No hace falta ser RL researcher para empezar. Una Alignerr RL task es un desafío de ingeniería pequeño con tres partes:

1. un **problem statement** claro para el modelo,
2. un **checker determinista** que scorea la respuesta final del modelo,
3. una **reference solution** confiable que prueba que la task es solvable.

En structural engineering tasks, el modelo puede elegir un retrofit layout, calibrar un modelo simplificado, escribir un analysis script, interpretar resultados, u optimizar un diseño bajo constraints. El grader convierte el resultado en un reward score de **0.0 a 1.0**.

Usar esta guía de producción con el starter template **`prometheus-structures`**. Ese starter setea:

```toml
[delivery].platform = "prometheus"
[delivery].eval = false
```

Los proyectos **eval** usan la misma ruta Prometheus, pero deben usar:

- `project_guidelines/strctural_engineering/PROMETHEUS_EVAL_STRUCTURAL_ENGINEER_OPENSEES_AUTHORING.md`
- el starter **`prometheus-eval-structures`**

---

## 1. What This Project Is

El repositorio es un **authoring template** para Alignerr RL tasks. Da el layout, harness local, grading library, entorno Docker y ejemplos para construir tasks bajo `problems/`.

Esta versión Prometheus mantiene la misma forma de task de structural engineering y los mismos trusted-CI checks que el workflow OpenSees estándar, pero **ruta las tasks que pasan al Prometheus Agent Service runner** en vez del delivery path por defecto.

Las variantes production y eval Prometheus siguen el mismo CI y submission route. El flag `eval` es metadata interna que indica a sistemas downstream si la task vino de un proyecto eval.

### Workflow a alto nivel

1. Escribir el task prompt en `instruction.md`.
2. Poner archivos públicos que el modelo puede inspeccionar en `data/`.
3. Poner fixtures de grading ocultos en `scorer/data/`.
4. Escribir un grader determinista en `scorer/compute_score.py`.
5. Escribir una oracle solution en `solution/solve.sh`.
6. Correr el harness local para probar que el oracle scorea **1.0**.
7. Correr un intento de modelo y usar el **PR Prometheus report** para confirmar que la task es suficientemente desafiante y tiene suficiente score diversity.

El modelo ve el prompt y los archivos públicos. El grader ve el output del modelo y los private scorer data. Esta separación es importante: permite usar hidden analysis cases, hidden target values, o fixed random seeds **sin filtrar la respuesta al modelo**.

### PR pipeline: Trusted CI → Prometheus → Labelbox

Después de authoring, el path de review es:

1. Abrir un PR en tu fork (**one task per PR**).
2. **Trusted CI** (`trusted-ci/grade`) corre primero. Auto QA es parte de este stage y es **advisory**: leer el verdict, pero por sí solo no significa que la task esté lista para submit.
3. Cuando Trusted CI pasa, **Prometheus corre automáticamente**. No hay paso Boreal ni Taiga en este Prometheus delivery path.
4. Esperar el comentario Prometheus en el PR. Antes de submittear la row para Labelbox review, estos **blocking gates** deben pasar:
   - average Prometheus target score **≤ 0.500**
   - Prometheus target score standard deviation **≥ 0.100**
   - required Prometheus target attempts **≥ 4**
5. El **trainability auditor** también corre en cada Prometheus submission. Es **advisory** (no bloquea CI por score), pero importa para RL quality. Apuntar a un final composite trainability score **≥ 40**. Un score **&lt; 40** suele significar que los failures observados no fueron model-controllable (environment, grader, o setup), así que el problema es un weak RL candidate aunque los blocking gates pasen.
6. Solo después de que pasen los blocking Prometheus gates, submittear la production row para Labelbox review. **No submittear** solo tras Trusted CI o Auto QA. Missing rollout o score-gate sections = **pending, not clean**.

---

## 2. RL in Plain English

Reinforcement learning mejora un modelo usando feedback de intentos. En estas tasks, el feedback es el **grader score**.

Un episode se ve así:

1. El modelo lee las task instructions.
2. Usa tools, escribe archivos, corre scripts, o razona el problema de ingeniería.
3. Guarda su final answer bajo `/tmp/output`.
4. El grader evalúa esa answer y retorna un reward de **0.0 a 1.0**.
5. Sistemas de training/evaluation usan ese reward para comparar intentos y mejorar comportamiento futuro.

Para una structural task, el reward puede basarse en drift reduction, analysis convergence, strength, cost, code checks, o agreement con hidden fixed cases. Si se puede definir qué es una buena engineering answer en términos medibles, se puede convertir eso en training signal.

---

## 3. Get Your Task Repo and Dependencies

Necesitás: **git**, **Docker**, y **uv**. Docker es necesario porque las tasks se chequean en containers que matchean el evaluation environment.

Antes de clonar nada: conectar tu cuenta GitHub al Labelbox project. New task pickup está disabled hasta que el GitHub account esté linked.

Luego pick up una task del project:

1. Ir al project en Labelbox.
2. Abrir el tab **Tasks**.
3. Elegir un task template.
4. Click en el **Content URL** de la task.

El Content URL abre el GitHub repo de esa task. Antes de editar, revisar:

- `README.md`
- `project_guidelines/strctural_engineering/PROMETHEUS_STRUCTURAL_ENGINEER_OPENSEES_AUTHORING.md`
- `examples/opensees-base-isolation/`

Clonar el task repo:

```bash
git clone git@github.com:Alignerr-Code-Labeling/lbx-rl-tasks-***.git
cd lbx-rl-tasks-***
uv sync
uv run lbx-rl-harness --help
```

`uv sync` instala el local grading package, el harness, y las Alignerr template utilities. Correr authoring commands desde la root del repo con `uv run ...`.

Para local model runs, crear `.env.local` desde el example:

```bash
cp .env.example .env.local
```

Editar `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-your-own-key-here
ANTHROPIC_MODEL=claude-fable-5
LBX_RL_HARNESS_MODEL=claude-fable-5
```

**No committear** `.env.local`. Es solo para la máquina local. El harness lo carga automáticamente al correr desde la root.

---

## 4. The RL Template Anatomy

Cada task vive en un directorio:

```text
problems/<task>/
|-- task.toml
|-- metadata.json
|-- instruction.md
|-- environment/
|   `-- Dockerfile
|-- data/
|-- scorer/
|   |-- compute_score.py
|   `-- data/
|-- solution/
|   |-- solve.sh
|   `-- render.sh        # opcional
`-- baselines/
    `-- naive.sh         # opcional
```

### Archivos principales

| Archivo | Rol |
|---------|-----|
| `instruction.md` | Prompt que ve el modelo |
| `task.toml` | Resources, required outputs, timeouts, difficulty metadata, ground-truth settings |
| `metadata.json` | Task identity para el benchmark |
| `environment/Dockerfile` | Instala deps y copia public/private files al container |
| `data/` | Archivos públicos en `/data` para el modelo |
| `scorer/compute_score.py` | Grading determinista |
| `scorer/data/` | Archivos privados solo para el grader |
| `solution/solve.sh` | Oracle answer — debe producir score **1.0** |
| `solution/render.sh` | Generación opcional de artifacts para reviewers |
| `baselines/naive.sh` | Weak baseline opcional para calibrar difficulty |

Los final model outputs deben ir siempre bajo **`/tmp/output`**. No pedir al modelo que ponga answers en `/workspace` u otra ubicación ad hoc.

---

## 5. Task Instructions Must Be Complete

Un buen task prompt debe sentirse como una engineering assignment bien escrita. El modelo no debería tener que adivinar.

### Incluir

- el deliverable exacto y path, p.ej. `/tmp/output/retrofit_design.json`
- el required file format y schema
- units, coordinate systems, naming conventions, y valid ranges
- engineering constraints (budget, strength limits, convergence requirements)
- qué public files hay en `/data`
- un short scoring summary en términos physics-grounded / **solver-agnostic**, sin revelar hidden case values ni private answers
- cualquier forbidden behavior (p.ej. escribir el output en otro lugar)

### Evitar

- wording ambiguo tipo "reasonable", "good", "efficient" sin definir cómo se mide
- hidden assumptions que no están en el prompt ni en public files
- pedir un unique solution path cuando muchos approaches válidos podrían existir
- grading criteria que no están mencionados en el prompt

**El prompt y el grader deben estar alineados.** Si el grader chequea cost, el prompt debe statear la cost formula. Si chequea story numbering, el prompt debe definir story numbering.

---

## 6. Worked Example: OpenSees Base Isolation

Ejemplo:

```text
examples/opensees-base-isolation
```

Pide diseñar un lead-rubber base-isolation system para un edificio de tres pisos. El agent elige `Qd_kip`, `Kd_kip_per_in`, y `Dy_in`, y submittea el design JSON.

Output requerido:

```text
/tmp/output/isolation_design.json
```

El hidden grader posee los private ground-motion records y la solver-backed final scoring run. El submitted ground-truth oracle path **debe incluir** solver-specific runnable material. Public debug assets pueden quedar bajo `/data`, pero **`instruction.md` no debe** referenciar el solver, requerir solver commands, ni pedir solver evidence.

### Keep solver requirements out of `instruction.md`

Toda structures task debe mantener `instruction.md` **solver-agnostic**. El prompt describe:

- el structural problem,
- design variables,
- deliverable schema,
- performance targets,
- acceptance limits,

**sin** nombrar OpenSees/OpenSeesPy, mencionar solvers, mandar commands, pedir solver evidence, ni hintar implementation details del solver/tool.

Sigue incluyendo physics-grounded scoring details en términos solver-agnostic.

Poner el solver-specific runnable material en la core solution (`solution/solve.sh` o archivos que llama). El solver requirement se enforcea vía oracle source, physics, hidden oracle/scorer, ground-truth proof, e image smoke tests; **no** exigir agent transcript ni solver-evidence artifact.

### Problem Definition

Prompt del modelo:

```text
examples/opensees-base-isolation/instruction.md
```

Define:

- building e isolation-system design variables
- required output path: `/tmp/output/isolation_design.json`
- public files bajo `/data`
- disclosed ground-motion band, performance targets, moat capacity, scoring curves
- tradeoff entre soft isolation, displacement demand, drift, acceleration, y base shear

### Public Data

```text
examples/opensees-base-isolation/data/
```

Archivos clave:

- `building_description.md` — structural model, isolation context, design rules
- `design_schema.json` — JSON schema exacto del answer
- `public_analysis_envelope.json` — disclosed analysis band, targets, scoring curves, hidden-case sampling policy
- `graded_case_sampling_policy.json` — deterministic stress-test envelope y suite composition
- `public_model_summary.py` y `isolation_starter.json` — constants y starter design data

Los public files ayudan a entender la task. **No** deben contener hidden oracle answer, private evaluation records, solver product names, solver command checklists, o solver-provenance requirements.

### Task Configuration

```text
examples/opensees-base-isolation/task.toml
```

Entries importantes:

- `[task]`: name y one-sentence description
- `[delivery]`: `platform = "prometheus"` y `eval = false` (production)
- `[environment]`: CPU, memory, storage, internet
- `[difficulty]`: `task_type = "structures"`, `domain`, `reward_type = "multi_deterministic_rubrics"`
- `[[outputs]]`: declara el required `/tmp/output/isolation_design.json`
- `[ground_truth]`: `in_container = true`, `score_epsilon`, `max_trivial_score`

Toda Prometheus structural engineering problem debe incluir:

```toml
[delivery]
platform = "prometheus"
eval = false

[difficulty]
task_type = "structures"
domain = ""   # tag específico soportado
reward_type = "multi_deterministic_rubrics"
```

`domain` se exporta como task tag. Tags soportados:

- `seismic_retrofit`
- `structural_mechanics`
- `topology_optimization`
- `truss_design`
- `frame_analysis`
- `beam_sizing`
- `buckling_analysis`
- `modal_analysis`
- `stress_displacement_analysis`
- `load_path_optimization`
- `finite_element_model_repair`
- `continuum_mechanics`
- `density_field_optimization`
- `support_member_repair`
- `mass_compliance_optimization`

`in_container = true` importa para OpenSees porque scorer y oracle dependen de packages en la task image (`openseespy`, `numpy`, etc.). El harness local corre oracle solve y grader **dentro** de la built task image y committea el build proof de ese environment.

### Grader and Reward

```text
examples/opensees-base-isolation/scorer/compute_score.py
```

Lee `isolation_design.json`, valida schema, corre deterministic solver-backed response-history analyses en hidden records, y retorna score dictionary.

Reward basado en worst-case hidden-record performance para:

- isolator displacement (con moat-capacity pounding gate separado)
- floor acceleration
- interstory drift ratio
- base-shear coefficient
- convergence y residual displacement

Invalid JSON, invalid design variables, non-convergence, missing outputs, u out-of-range designs → **0.0** vía AgentFault o metric gates.

Private fixed cases:

```text
examples/opensees-base-isolation/scorer/data/hidden_cases.json
```

Para el grader, **no** para el modelo.

### Oracle Solution

```text
examples/opensees-base-isolation/solution/solve.sh
```

Busca en-band public-style motions, escribe un known-good `isolation_design.json`, y debe scorear **1.0** bajo el hidden grader.

```bash
uv run lbx-rl-harness run \
  --runtime ground-truth \
  --problem-dir examples/opensees-base-isolation
```

Un passing run escribe:

```text
examples/opensees-base-isolation/.alignerr/build_proof.json
```

Este example tiene `rendered = false` y no declara reviewer video output. Si la task beneficia de un visual artifact, declarar `render_outputs` explícitamente y mantener render generation deterministic.

---

## 7. Validate That the Task Challenges the Prometheus Target

Ground truth passing es necesario, pero **no suficiente**. Una task es útil para RL solo si el Prometheus target run no puede trivialmente sacar score perfecto, y si produce suficiente spread across repeated attempts.

### Local model attempt

```bash
cp .env.example .env.local
# editar ANTHROPIC_* y LBX_RL_HARNESS_MODEL

uv run lbx-rl-harness run \
  --runtime claude-code \
  --problem-dir examples/opensees-base-isolation
```

Resultados bajo `.harness-runs/`:

```text
.harness-runs/<run>/transcript.txt
.harness-runs/<run>/workspace/
.harness-runs/<run>/verifier/reward.json
.harness-runs/<run>/verifier/reward-details.json
```

Chequear:

1. ¿El modelo entendió el prompt y produjo el required file?
2. ¿El grader corrió limpio y devolvió un score meaningful?
3. ¿El modelo evitó un perfect **1.0**?

### PR Prometheus Score and Diversity Target

Tras abrir el task PR, trusted CI corre numerical-solver gates: solver-agnostic instruction checks, deterministic grader QA, ground-truth validation, render artifact validation (si declared), local agent scoring, y score-bounds gating. Si pasan, la task se exporta a Harbor y se submittea a Prometheus.

El comentario Prometheus reporta aggregate target-model rewards. Tratarlo como el **authoritative difficulty signal**, no el local single-agent run.

**Timing:** el primer `trusted-ci/grade` suele aparecer tras local mothership gates (~10–15 min para solver tasks típicas). Las Prometheus rollout metrics llegan después. Structures solver-heavy pueden tardar más.

### Targets

**Blocking:**

| Gate | Threshold |
|------|-----------|
| Average Prometheus target score | **≤ 0.500** |
| Target score std. deviation | **≥ 0.100** |
| Required target attempts | **≥ 4** |

**Advisory (siempre corre; no bloquea CI por score):**

| Metric | Target |
|--------|--------|
| Final composite trainability score | **≥ 40** |
| Below 40 | Failures often not model-controllable → weak RL candidate |

Si average score **&gt; 0.500** → task demasiado fácil.  
Si stddev **&lt; 0.100** → demasiado binary / determinista / constrained.

Si el modelo scorea **1.0**, la task puede ser demasiado fácil, demasiado constrained a una respuesta obvia, o estar filtrando la solution. **No** esconder instructions esenciales para hacerla más hard. En cambio:

- agregar más hidden fixed cases
- variar load cases o geometry dentro de public assumptions
- agrandar el design space manteniendo schema claro
- agregar constraints meaningful (cost, convergence, drift, robustness)
- mejorar baseline y oracle anchors
- remover hints accidentales del oracle layout
- reducir all-or-nothing score cliffs
- agregar independent hidden checks para que matchear un public pattern no baste

Si stddev es bajo: mejorar **score resolution**, no agregar randomness. Buenos fixes: smoother partial-credit curves, independently weighted response criteria, hidden cases con distintos failure modes, scoring que separe formatting / feasibility / solver health / nominal response / robustness.

Goal: problema de ingeniería justo donde un strong model puede progresar, pero el Prometheus target average se queda bajo el ceiling y hay diversity suficiente para training.

---

## 8. Final Author Checklist

Antes de abrir/actualizar un task PR:

- [ ] `instruction.md` completo, no ambiguo, alineado con el grader
- [ ] Required output path bajo `/tmp/output`
- [ ] Public files en `data/` tienen lo que el modelo necesita, sin hidden answers
- [ ] Private fixtures bajo `scorer/data/`
- [ ] `scorer/compute_score.py` determinista, score en `[0, 1]`
- [ ] `solution/solve.sh` produce required files y scorea **1.0**
- [ ] Rendering funciona si `[ground_truth].render_outputs` está declared
- [ ] Local ground-truth validation pasa:

```bash
uv run lbx-rl-harness run \
  --runtime ground-truth \
  --problem-dir problems/<task>
```

- [ ] Optional static validation:

```bash
uv run lbx-rl-template validate --problem-dir problems/<task>
```

- [ ] Local model run **no** scorea 100%:

```bash
uv run lbx-rl-harness run \
  --runtime claude-code \
  --problem-dir problems/<task>
```

- [ ] Full Prometheus workflow pasa: average ≤ 0.500, stddev ≥ 0.100, ≥ 4 attempts
- [ ] Trainability composite ≥ 40 (advisory pero importante)
- [ ] `.alignerr/build_proof.json` committed tras final task edits
- [ ] `.alignerr/ground_truth/` artifacts committed si la task los declara
- [ ] `.env.local`, `.harness-runs/`, API keys, secrets **no** committed

**Passing `submit-prometheus`** = la production row puede ir a review. No submittear non-passing rows. Submitting failed/pending rows viola fair practices y puede sacar al tasker del project.

**Diversity y originality required.** Problems submitted a original CFD o structures projects, o previamente a Boreal, **no** deben resubmittearse a Prometheus. Se rechazan, cuentan como cheating, y pueden warrant removal.

---

## 9. Grader Security and Calibration (Mandatory)

Estas reglas encodean failure modes que el Env Linter bloquea en "Ready for Customer". El local validator (`uv run lbx-rl-template validate`) y CI enforcean la mayoría; una task que tripea un blocking check pasa a **Failed QA**.

### 9.1 Never import, exec, or eval the model's code in the grader

El grading process corre como **root** para leer `scorer/data/` (mounted en `/mcp_server/data`, mode `0600`). Si `compute_score.py` carga Python del modelo vía `importlib`, `runpy`, `exec`/`eval`, ese código corre como root: puede monkeypatch scoring, robar hidden answer, o importar private reference → score 1.0 sin real work.

Si la task pide un Python processor, llamar via sandbox:

```python
from grading import helpers

result = helpers.run_model_module(
    workspace / "fixed_fiber_section_processor.py",
    "evaluate_section",
    str(public_case_path),
)
# result crossed a JSON boundary from a NON-root subprocess;
# never trust the module's stdout.
```

`run_model_module` / `helpers.run_policy` corren la submission en subprocess non-root que **no** puede leer fixtures `0600`. El validator stage `grader_sandbox` falla cualquier `scorer/*.py` que use dynamic-exec primitives.

### 9.2 Lock down private fixtures in the Dockerfile

Copiar `scorer/` y `scorer/data/` root-owned e unreadable al agent. Bloque canónico:

```dockerfile
COPY --chown=root:root ${PROBLEM_DIR}/scorer/data/ /mcp_server/data/
COPY --chown=root:root ${PROBLEM_DIR}/scorer/ /mcp_server/grader/
RUN rm -rf /mcp_server/grader/data \
    && chown -R root:root /mcp_server/data /mcp_server/grader \
    && find /mcp_server/data /mcp_server/grader -type d -exec chmod 0700 {} + \
    && find /mcp_server/data /mcp_server/grader -type f -exec chmod 0600 {} +
```

Un plain `COPY scorer/data/ /mcp_server/data/` deja files world-readable (`0644`): el agent puede `cat` hidden cases. El validator stage `private_data_layout` requiere este hardening (o `--chmod=0600 COPY`).

### 9.3 The oracle must reach 1.0 through the real numeric path

`solution/solve.sh` debe scorear 1.0 **corriendo el análisis real** que el grader scorea — no vía exact-string-match shortcut. No escribir `if submission == oracle_design: return 1.0`. Si el oracle no scorea ~1.0 por el numeric path, la calibración está mal: fix tolerances/bands/reference values, no la comparison.

### 9.4 Doing nothing (or copying the example) must score ~0

El validator grades empty/no-op y, cuando extractable, el example del prompt; falla si scorea arriba de `[ground_truth].max_trivial_score` (default **0.5**). Guardrail subscores deben gated on non-trivial progress para que `{"devices": []}` no colecte credit.

### 9.5 Prefer numeric criteria; never reward sentiment over correctness

Text/keyword criteria son stuffing-able. Tie credit al numeric result. Nunca scorear conclusión por sentimiento positivo ("viable/safe") ni penalizar verdict negativo honesto ("unsafe") — un honest negative engineering judgment debe poder earn full credit. Advisory: `uv run lbx-rl-template lint-reward-hacks`.

### 9.6 Disclose everything the grader checks

Public data, tolerances, required output keys, sign/unit conventions, rounding/precision deben aparecer en `instruction.md` o `data/`. Undocumented exact tolerance o undocumented boolean key silenciosamente capan runs honestos.

---

## 10. Env Pre-flight QA — What CI Checks Before Prometheus (Mandatory)

Cada task PR corre blocking env pre-flight QA en trusted CI **antes** de cualquier Prometheus export. Error findings fallan `trusted-ci/grade` y **skip** Prometheus delivery. Findings con suggested fixes aparecen en el PR comment bajo **Prometheus Eval — Env QA Pre-flight**.

### 10.1 Oracle must derive its answer from public inputs

`solution/solve.sh` que solo heredocs literal JSON es la canonical unsolvable-task signature: las constants encodean conocimiento del hidden spec, así que "oracle scores 1.0" no prueba que un agent pueda resolver desde lo que ve. **Blocking.**

Escribir el oracle como real computation: leer `/data/*.json`, build model (OpenSeesPy u otro), solve, write result. Si no se puede escribir tal oracle → task unsolvable as specified: disclose missing measurement data o weaken hidden divergence (10.2).

### 10.2 Hidden grading data must be reachable from disclosed data

Si el grader scorea contra hidden values dentro de tight tolerances, un agent debe poder estimar esos values desde disclosed files. Pre-flight QA pares numeric keys en `scorer/data/*.json` vs `data/*.json` (y `true_*` vs `nominal_*`) y bloquea cuando la divergence dwarfs la tightest tolerance.

Ejemplo real: Rayleigh-damping task con hidden as-built frequencies 20–36% off nominal, pero anchors toleraban 1.5–4% — honest attempts flatlinearon en 0.15 validity floor.

Fix: (a) agregar measurement data bajo `data/` y referenciarlo en el prompt, o (b) regenerar hidden spec como mild perturbation consistente con tolerances.

### 10.3 Framing must match hidden magnitudes

LLM disclosure review compara prompt narrative vs hidden data. "Construction tolerances and in-service degradation" describiendo 67% stiffness loss = misleading-framing error. Decir qué esperar ("frequencies may differ from nominal by up to X%") o supply data que lo revele.

### 10.4 No subscore floor earnable by junk

Validity/guardrail subscores deben verificar structure, no un scalar que un constants-only submission puede hit. Constrain implied physics, o gate the floor on evidence of real work.

### 10.5 Where you see the results

- PR comment → sección **Prometheus — Env QA Pre-flight**
- Blocking error findings → `env_preflight` falla, Prometheus skipped
- Advisory warning/info → task procede; findings echoed bajo Prometheus
- Absence of section = **pending, not clean**

Localmente (desde mothership checkout):

```bash
python3 .github/scripts/env_preflight_qa.py \
  --problem-dir problems/<task> --skip-llm
```

(Drop `--skip-llm` con `ANTHROPIC_API_KEY` seteado para full review.)

---

## Quick reference — gates

| Stage | Qué | Blocking? |
|-------|-----|-----------|
| Trusted CI / Env Pre-flight | Security, oracle solvability, disclosure, grader QA | Sí |
| Auto QA | Advisory verdict | No |
| Prometheus average score | ≤ 0.500 | Sí |
| Prometheus stddev | ≥ 0.100 | Sí |
| Prometheus attempts | ≥ 4 | Sí |
| Trainability composite | ≥ 40 | Advisory |

---

## Notas locales

- Nombre del starter production: `prometheus-structures`
- Eval counterpart: `prometheus-eval-structures` + guide `PROMETHEUS_EVAL_STRUCTURAL_ENGINEER_OPENSEES_AUTHORING.md`
- Typo en path upstream: `strctural_engineering` (falta una `u`) — igual que en Labelbox/GitHub
- No resubmittear problems de CFD/structures originales ni Boreal a Prometheus
