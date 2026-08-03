import type { PythonAiLesson } from "./lesson.types";

/**
 * Track IA + Python para frontend seniors: backends ligeros, APIs LLM,
 * RAG/agents prácticos — no ML research.
 */
export const PYTHON_AI_LESSONS: PythonAiLesson[] = [
  {
    slug: "why-python-ai",
    order: 0,
    hours: 1,
    title: {
      es: "Por qué Python si sos frontend",
      en: "Why Python if you're a frontend engineer",
    },
    summary: {
      es: "Posicionamiento: scripts, FastAPI y glue con LLMs — no competir con data science.",
      en: "Positioning: scripts, FastAPI, and LLM glue — not competing with data science.",
    },
    body: {
      es: "Como frontend senior, Python te sirve para automatizar, exponer APIs chicas y orquestar modelos. El diferencial no es entrenar redes: es producto + agentes + integraciones. Este módulo está pensado para sumar evidencia en el CV junto a React/Next.",
      en: "As a senior frontend, Python helps you automate, expose small APIs, and orchestrate models. The edge isn't training nets: it's product + agents + integrations. This module is built to add CV evidence next to React/Next.",
    },
    bullets: [
      {
        es: "Objetivo laboral: Product Engineer / AI-adjacent fullstack, no ML Engineer.",
        en: "Career goal: Product Engineer / AI-adjacent fullstack, not ML Engineer.",
      },
      {
        es: "Stack puente: TypeScript en UI + Python en tool/API.",
        en: "Bridge stack: TypeScript in UI + Python in tools/APIs.",
      },
    ],
    deliverable: {
      es: "Nota de 5 líneas: tu caso de uso Python+IA (ej. scraper + resumen LLM).",
      en: "5-line note: your Python+AI use case (e.g. scraper + LLM summary).",
    },
    resources: [
      {
        label: { es: "Python oficial — tutorial", en: "Official Python tutorial" },
        href: "https://docs.python.org/3/tutorial/",
      },
    ],
  },
  {
    slug: "python-core-refresh",
    order: 1,
    hours: 3,
    title: {
      es: "Core Python rápido",
      en: "Python core refresh",
    },
    summary: {
      es: "Tipado, venv, poetry/uv, dataclasses, async básico — lo mínimo para backends.",
      en: "Typing, venv, poetry/uv, dataclasses, basic async — minimum for backends.",
    },
    body: {
      es: "Instalá Python 3.12+, creá un venv, y practicá: funciones tipadas, list/dict comprehensions, pathlib, requests/httpx, y un script CLI con argparse. Preferí uv o poetry para deps. No profundices en OOP pesada: scripts claros + tipos.",
      en: "Install Python 3.12+, create a venv, and practice: typed functions, list/dict comprehensions, pathlib, requests/httpx, and a CLI script with argparse. Prefer uv or poetry for deps. Skip heavy OOP: clear scripts + types.",
    },
    bullets: [
      {
        es: "Entregar: repo `py-ai-lab` con README y un script `hello_http.py`.",
        en: "Ship: `py-ai-lab` repo with README and `hello_http.py`.",
      },
    ],
    deliverable: {
      es: "Script que hace GET a una API pública y imprime JSON filtrado.",
      en: "Script that GETs a public API and prints filtered JSON.",
    },
    resources: [
      {
        label: { es: "uv — docs", en: "uv docs" },
        href: "https://docs.astral.sh/uv/",
      },
      {
        label: { es: "httpx", en: "httpx" },
        href: "https://www.python-httpx.org/",
      },
    ],
  },
  {
    slug: "fastapi-bff",
    order: 2,
    hours: 4,
    title: {
      es: "FastAPI como BFF / microservicio",
      en: "FastAPI as BFF / microservice",
    },
    summary: {
      es: "Endpoints tipados, Pydantic, CORS, y contrato que Next pueda consumir.",
      en: "Typed endpoints, Pydantic, CORS, and a contract Next can consume.",
    },
    body: {
      es: "Creá una app FastAPI con GET/POST, modelos Pydantic, validación automática y docs OpenAPI. Exponé CORS a localhost:3000. Pensalo como el twin Python del kit-api de Adolfo: mismo espíritu CRUD/health, listo para un BFF.",
      en: "Build a FastAPI app with GET/POST, Pydantic models, auto validation, and OpenAPI docs. Enable CORS for localhost:3000. Think of it as Adolfo's kit-api twin in Python: same CRUD/health spirit, BFF-ready.",
    },
    deliverable: {
      es: "Repo con `/health` + `/items` CRUD en memoria y screenshot de /docs.",
      en: "Repo with `/health` + in-memory `/items` CRUD and a /docs screenshot.",
    },
    resources: [
      {
        label: { es: "FastAPI tutorial", en: "FastAPI tutorial" },
        href: "https://fastapi.tiangolo.com/tutorial/",
      },
    ],
  },
  {
    slug: "llm-api-scripts",
    order: 3,
    hours: 3,
    title: {
      es: "Scripts contra APIs LLM",
      en: "Scripts against LLM APIs",
    },
    summary: {
      es: "Llamadas a OpenAI/Anthropic/Azure desde Python: prompts, JSON mode, costos.",
      en: "Calls to OpenAI/Anthropic/Azure from Python: prompts, JSON mode, costs.",
    },
    body: {
      es: "Usá el SDK oficial (o httpx) con API key en env. Implementá un CLI que reciba texto y devuelva un resumen estructurado (JSON). Logueá tokens si el provider lo expone. Nunca hardcodees secrets.",
      en: "Use the official SDK (or httpx) with an API key from env. Build a CLI that takes text and returns a structured summary (JSON). Log tokens when the provider exposes them. Never hardcode secrets.",
    },
    deliverable: {
      es: "`summarize.py` + `.env.example` + output JSON de ejemplo (sin keys).",
      en: "`summarize.py` + `.env.example` + sample JSON output (no keys).",
    },
    resources: [
      {
        label: { es: "OpenAI API reference", en: "OpenAI API reference" },
        href: "https://platform.openai.com/docs/api-reference",
      },
    ],
  },
  {
    slug: "rag-lite",
    order: 4,
    hours: 4,
    title: {
      es: "RAG ligero",
      en: "Lightweight RAG",
    },
    summary: {
      es: "Chunking, embeddings, retrieval simple (chroma/faiss local) + respuesta con citas.",
      en: "Chunking, embeddings, simple retrieval (local chroma/faiss) + cited answers.",
    },
    body: {
      es: "Indexá 3–5 docs markdown propios (CV, README, notas). Chunk + embed + query. El LLM solo responde con contexto recuperado. Enfocate en el pipeline, no en fine-tuning.",
      en: "Index 3–5 of your own markdown docs (CV, README, notes). Chunk + embed + query. The LLM answers only with retrieved context. Focus on the pipeline, not fine-tuning.",
    },
    deliverable: {
      es: "Demo CLI: pregunta → respuesta + lista de fuentes.",
      en: "CLI demo: question → answer + source list.",
    },
    resources: [
      {
        label: { es: "LangChain RAG tutorial (opcional)", en: "LangChain RAG tutorial (optional)" },
        href: "https://python.langchain.com/docs/tutorials/rag/",
      },
    ],
  },
  {
    slug: "python-agents-tools",
    order: 5,
    hours: 4,
    title: {
      es: "Agentes con tools en Python",
      en: "Agents with tools in Python",
    },
    summary: {
      es: "Loop plan→act→observe con 1–2 tools (http, filesystem). Límites y timeouts.",
      en: "Plan→act→observe loop with 1–2 tools (http, filesystem). Limits and timeouts.",
    },
    body: {
      es: "Implementá un agente mínimo: el modelo elige tool, ejecutás la función, devolvés observación. Máximo N pasos. Compará mentalmente con el curso Microsoft AI Agents (TS/Python samples) — acá el deliverable es tuyo y pequeño.",
      en: "Build a minimal agent: the model picks a tool, you run the function, return observation. Cap at N steps. Mentally compare with Microsoft AI Agents (TS/Python samples) — here the deliverable is yours and small.",
    },
    deliverable: {
      es: "Agente con tool `fetch_url` o `read_file` + log del loop.",
      en: "Agent with `fetch_url` or `read_file` tool + loop log.",
    },
    resources: [
      {
        label: {
          es: "Adolfo — AI Agents (Microsoft)",
          en: "Adolfo — AI Agents (Microsoft)",
        },
        href: "/learn/ai-agents",
      },
    ],
  },
  {
    slug: "evals-guardrails",
    order: 6,
    hours: 2,
    title: {
      es: "Evals y guardrails básicos",
      en: "Basic evals and guardrails",
    },
    summary: {
      es: "Casos de prueba, asserts de formato, deny-lists — calidad sin MLOps pesado.",
      en: "Test cases, format asserts, deny-lists — quality without heavy MLOps.",
    },
    body: {
      es: "Escribí 5 casos (input → output esperado parcial). Corré el pipeline y fallá el CI si el JSON no matchea schema. Añadí un guardrail simple (rechazar PII obvia o prompts de jailbreak triviales).",
      en: "Write 5 cases (input → partial expected output). Run the pipeline and fail CI if JSON doesn't match schema. Add a simple guardrail (reject obvious PII or trivial jailbreaks).",
    },
    deliverable: {
      es: "`tests/test_summarize.py` con pytest + 1 guardrail documentado.",
      en: "`tests/test_summarize.py` with pytest + 1 documented guardrail.",
    },
    resources: [
      {
        label: { es: "pytest", en: "pytest" },
        href: "https://docs.pytest.org/",
      },
    ],
  },
  {
    slug: "ship-portfolio",
    order: 7,
    hours: 3,
    title: {
      es: "Ship: portfolio + Next bridge",
      en: "Ship: portfolio + Next bridge",
    },
    summary: {
      es: "Docker opcional, README de hiring, y opcional proxy desde Adolfo/Next.",
      en: "Optional Docker, hiring README, and optional proxy from Adolfo/Next.",
    },
    body: {
      es: "Empaquetá el mejor deliverable (FastAPI o agente) con README orientado a recruiter: problema, stack, cómo correr, demo. Si podés, consumilo desde una page Next (fetch al BFF). Linkeá el repo en LinkedIn/CV.",
      en: "Package your best deliverable (FastAPI or agent) with a recruiter-oriented README: problem, stack, how to run, demo. If you can, consume it from a Next page (fetch to BFF). Link the repo on LinkedIn/CV.",
    },
    deliverable: {
      es: "README + repo público + (opcional) ruta en Adolfo que pegue al API.",
      en: "README + public repo + (optional) Adolfo route hitting the API.",
    },
  },
];

export function getLessonBySlug(slug: string): PythonAiLesson | undefined {
  return PYTHON_AI_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getAdjacentLessons(slug: string): {
  prev: PythonAiLesson | null;
  next: PythonAiLesson | null;
} {
  const index = PYTHON_AI_LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? PYTHON_AI_LESSONS[index - 1]! : null,
    next:
      index < PYTHON_AI_LESSONS.length - 1
        ? PYTHON_AI_LESSONS[index + 1]!
        : null,
  };
}
