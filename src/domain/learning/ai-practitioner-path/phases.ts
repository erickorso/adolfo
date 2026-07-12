import type { PathPhase } from "./path.types";

export const AI_PRACTITIONER_PHASES: PathPhase[] = [
  {
    slug: "fundamentos",
    order: 0,
    title: {
      es: "Fase 0 — Fundamentos",
      en: "Phase 0 — Foundations",
    },
    summary: {
      es: "Prompts, patrones de agentes y curso Microsoft ya integrado en Adolfo. Base técnica antes de automatizar o publicar.",
      en: "Prompts, agent patterns, and the Microsoft course already in Adolfo. Technical base before automating or shipping.",
    },
    durationWeeks: "2–3",
    relatedHref: "/learn/ai-agents",
    relatedLabel: {
      es: "Abrir curso AI Agents (Microsoft)",
      en: "Open AI Agents course (Microsoft)",
    },
    steps: [
      {
        id: "prompts-first",
        order: 1,
        title: {
          es: "Prompt engineering desde el día 1",
          en: "Prompt engineering from day one",
        },
        body: {
          es: "System prompts, few-shot, límites de contexto y evaluación rápida. No esperes al paso 7 del roadmap viral: los prompts son la interfaz de todo lo demás.",
          en: "System prompts, few-shot, context limits, and quick evaluation. Don't wait for step 7 of viral roadmaps — prompts are the interface to everything else.",
        },
        deliverable: {
          es: "5 prompts reutilizables en jobs/ o notas del módulo",
          en: "5 reusable prompts in jobs/ or module notes",
        },
      },
      {
        id: "ms-ai-agents",
        order: 2,
        title: {
          es: "Curso Microsoft AI Agents (Adolfo)",
          en: "Microsoft AI Agents course (Adolfo)",
        },
        body: {
          es: "Completá lecciones 0–4 mínimo: setup, modelos, tool use, RAG. Seguimiento, quizzes y certificado ya están en /learn/ai-agents.",
          en: "Complete lessons 0–4 minimum: setup, models, tool use, RAG. Tracking, quizzes, and certificate live at /learn/ai-agents.",
        },
        deliverable: {
          es: "Lecciones 0–4 completadas + quiz aprobado",
          en: "Lessons 0–4 completed + quiz passed",
        },
      },
      {
        id: "agent-patterns",
        order: 3,
        title: {
          es: "Patrones: loop, tools, memoria",
          en: "Patterns: loop, tools, memory",
        },
        body: {
          es: "Entendé el ciclo agente (plan → act → observe) sin casarte con un vendor. Aplica igual a Claude, OpenAI, Ollama o n8n.",
          en: "Understand the agent cycle (plan → act → observe) without vendor lock-in. Same for Claude, OpenAI, Ollama, or n8n.",
        },
        deliverable: {
          es: "Diagrama o nota: 1 flujo agente en Adolfo",
          en: "Diagram or note: 1 agent flow in Adolfo",
        },
      },
    ],
  },
  {
    slug: "dev-agentic",
    order: 1,
    title: {
      es: "Fase 1 — Dev agentic",
      en: "Phase 1 — Agentic development",
    },
    summary: {
      es: "Cursor, skills, MCP y validación automática. Claude/Cursor como acelerador de desarrollo, no como el producto final.",
      en: "Cursor, skills, MCP, and automated validation. Claude/Cursor as a dev accelerator, not the end product.",
    },
    durationWeeks: "1–2",
    steps: [
      {
        id: "cursor-workflow",
        order: 1,
        title: {
          es: "Flujo Cursor + reglas del repo",
          en: "Cursor workflow + repo rules",
        },
        body: {
          es: "AGENTS.md, skills, hooks pre-commit (typecheck, lint). Una feature real en Adolfo hecha mayormente con agente.",
          en: "AGENTS.md, skills, pre-commit hooks (typecheck, lint). One real Adolfo feature built mostly with the agent.",
        },
        deliverable: {
          es: "docs/claude-code-workflow.md o skill documentado",
          en: "docs/claude-code-workflow.md or documented skill",
        },
      },
      {
        id: "mcp-tools",
        order: 2,
        title: {
          es: "MCP y herramientas externas",
          en: "MCP and external tools",
        },
        body: {
          es: "Conectar fuentes (docs, APIs, DB read-only) al IDE. Mismo concepto que tools en agentes de producción.",
          en: "Connect sources (docs, APIs, read-only DB) to the IDE. Same concept as production agent tools.",
        },
        deliverable: {
          es: "1 MCP o script de automatización útil",
          en: "1 useful MCP or automation script",
        },
      },
    ],
  },
  {
    slug: "automatizacion",
    order: 2,
    title: {
      es: "Fase 2 — Automatización",
      en: "Phase 2 — Automation",
    },
    summary: {
      es: "n8n + Docker (+ Ollama opcional). Un solo bloque operativo: webhooks, cron y agentes visuales.",
      en: "n8n + Docker (+ optional Ollama). One ops block: webhooks, cron, and visual agents.",
    },
    durationWeeks: "2",
    steps: [
      {
        id: "n8n-docker",
        order: 1,
        title: {
          es: "n8n self-hosted con Docker",
          en: "Self-hosted n8n with Docker",
        },
        body: {
          es: "Alojá n8n local o en VPS. Workflow: Remotive/API → POST /api/jobs/ingest con secret. Alertas email/Telegram.",
          en: "Host n8n locally or on a VPS. Workflow: Remotive/API → POST /api/jobs/ingest with secret. Email/Telegram alerts.",
        },
        deliverable: {
          es: "Export JSON del workflow en docs/n8n/",
          en: "Workflow JSON export in docs/n8n/",
        },
      },
      {
        id: "n8n-ai-agents",
        order: 2,
        title: {
          es: "Agentes de IA dentro de n8n",
          en: "AI agents inside n8n",
        },
        body: {
          es: "Nodos AI, tool calling y orquestación sin redeploy. Ideal para prototipos de pipeline antes de codificar en Next.js.",
          en: "AI nodes, tool calling, orchestration without redeploy. Great for pipeline prototypes before coding in Next.js.",
        },
        deliverable: {
          es: "1 workflow con nodo AI + webhook",
          en: "1 workflow with AI node + webhook",
        },
      },
      {
        id: "ollama-local",
        order: 3,
        title: {
          es: "Ollama (LLM local, opcional)",
          en: "Ollama (local LLM, optional)",
        },
        body: {
          es: "Modelos on-premise para prototipos sin coste API. Útil para datos sensibles o desarrollo offline.",
          en: "On-prem models for API-free prototypes. Useful for sensitive data or offline dev.",
        },
        deliverable: {
          es: "1 modelo corriendo + curl de prueba",
          en: "1 model running + test curl",
        },
      },
    ],
  },
  {
    slug: "producto-portfolio",
    order: 3,
    title: {
      es: "Fase 3 — Producto y portfolio",
      en: "Phase 3 — Product & portfolio",
    },
    summary: {
      es: "Asistente en Adolfo, demos públicas, nicho y publicación. Donde el roadmap viral mezcla negocio — aquí con entregables concretos.",
      en: "Assistant in Adolfo, public demos, niche, and publishing. Where viral roadmaps mix business — here with concrete deliverables.",
    },
    durationWeeks: "4+",
    relatedHref: "/learn/ai-agents",
    relatedLabel: {
      es: "Seguir lecciones avanzadas (MCP, producción)",
      en: "Continue advanced lessons (MCP, production)",
    },
    steps: [
      {
        id: "personal-assistant",
        order: 1,
        title: {
          es: "Asistente personal (RAG + contexto)",
          en: "Personal assistant (RAG + context)",
        },
        body: {
          es: "Segundo cerebro: CV, jobs, notas. Wire futuro: sidebar Module Federation (mfe-demo/remote-sidebar) → chat Adolfo.",
          en: "Second brain: CV, jobs, notes. Future wire: MFE sidebar (mfe-demo/remote-sidebar) → Adolfo chat.",
        },
        deliverable: {
          es: "MVP chat con contexto de 1 dominio (jobs o learn)",
          en: "MVP chat with context from 1 domain (jobs or learn)",
        },
      },
      {
        id: "saas-replica",
        order: 2,
        title: {
          es: "Replica un SaaS probado con IA",
          en: "Replicate a proven SaaS with AI",
        },
        body: {
          es: "Elegí un nicho que te guste. Cloná una pieza acotada (onboarding, search, copilot) con stack que ya dominás: React, Next, APIs.",
          en: "Pick a niche you like. Clone one bounded piece (onboarding, search, copilot) with your stack: React, Next, APIs.",
        },
        deliverable: {
          es: "Demo deployada (Vercel) + README",
          en: "Deployed demo (Vercel) + README",
        },
      },
      {
        id: "agent-demos",
        order: 3,
        title: {
          es: "3–5 demos de agentes",
          en: "3–5 agent demos",
        },
        body: {
          es: "Portfolio verificable: repo + video corto o GIF. Ej.: ingest jobs, quiz AI Agents, métricas, MFE shell.",
          en: "Verifiable portfolio: repo + short video or GIF. E.g. jobs ingest, AI Agents quiz, metrics, MFE shell.",
        },
        deliverable: {
          es: "3 repos o rutas /learn enlazadas en GitHub profile",
          en: "3 repos or /learn routes linked on GitHub profile",
        },
      },
      {
        id: "publish",
        order: 4,
        title: {
          es: "Publicá lo que construís",
          en: "Publish what you build",
        },
        body: {
          es: "Posts, outreach, changelog en Adolfo. La visibilidad cierra el loop del aprendizaje.",
          en: "Posts, outreach, Adolfo changelog. Visibility closes the learning loop.",
        },
        deliverable: {
          es: "2 publicaciones + 10 contactos outreach",
          en: "2 posts + 10 outreach contacts",
        },
      },
    ],
  },
];

export function getPhaseBySlug(slug: string) {
  return AI_PRACTITIONER_PHASES.find((phase) => phase.slug === slug);
}
