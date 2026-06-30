import type { AiAgentsLesson } from "./lesson.types";

/** Lecciones alineadas con microsoft/ai-agents-for-beginners (main). */
export const AI_AGENTS_LESSONS: AiAgentsLesson[] = [
  {
    slug: "course-setup",
    order: 0,
    folder: "00-course-setup",
    title: {
      es: "Configuración del curso",
      en: "Course setup",
    },
    summary: {
      es: "Requisitos, Azure AI Foundry, Microsoft Agent Framework y cómo ejecutar los samples de Python.",
      en: "Requirements, Azure AI Foundry, Microsoft Agent Framework, and how to run the Python samples.",
    },
  },
  {
    slug: "intro-to-ai-agents",
    order: 1,
    folder: "01-intro-to-ai-agents",
    videoId: "3zgm60bXmQk",
    title: {
      es: "Introducción a agentes de IA",
      en: "Intro to AI agents",
    },
    summary: {
      es: "Qué es un agente, casos de uso y cuándo conviene un flujo agéntico frente a un chat simple.",
      en: "What an agent is, use cases, and when agentic flows beat a simple chat.",
    },
  },
  {
    slug: "agentic-frameworks",
    order: 2,
    folder: "02-explore-agentic-frameworks",
    videoId: "ODwF-EZo_O8",
    title: {
      es: "Frameworks agénticos",
      en: "Agentic frameworks",
    },
    summary: {
      es: "Panorama de frameworks y cómo Microsoft Agent Framework encaja en el stack.",
      en: "Framework landscape and where Microsoft Agent Framework fits in the stack.",
    },
  },
  {
    slug: "design-patterns",
    order: 3,
    folder: "03-agentic-design-patterns",
    videoId: "m9lM8qqoOEA",
    title: {
      es: "Patrones de diseño agéntico",
      en: "Agentic design patterns",
    },
    summary: {
      es: "Patrones base para construir agentes mantenibles: roles, estado, herramientas y límites.",
      en: "Core patterns for maintainable agents: roles, state, tools, and boundaries.",
    },
  },
  {
    slug: "tool-use",
    order: 4,
    folder: "04-tool-use",
    videoId: "vieRiPRx-gI",
    title: {
      es: "Patrón Tool Use",
      en: "Tool use design pattern",
    },
    summary: {
      es: "Cómo un agente invoca APIs, funciones y servicios externos de forma segura.",
      en: "How agents call APIs, functions, and external services safely.",
    },
  },
  {
    slug: "agentic-rag",
    order: 5,
    folder: "05-agentic-rag",
    videoId: "WcjAARvdL7I",
    title: {
      es: "RAG agéntico",
      en: "Agentic RAG",
    },
    summary: {
      es: "Recuperación de contexto orquestada por el agente, no solo embedding + prompt fijo.",
      en: "Context retrieval orchestrated by the agent—not just embeddings plus a fixed prompt.",
    },
  },
  {
    slug: "trustworthy-agents",
    order: 6,
    folder: "06-building-trustworthy-agents",
    videoId: "iZKkMEGBCUQ",
    title: {
      es: "Agentes confiables",
      en: "Trustworthy AI agents",
    },
    summary: {
      es: "Evaluación, guardrails, trazabilidad y diseño para reducir alucinaciones y acciones riesgosas.",
      en: "Evaluation, guardrails, traceability, and design to reduce hallucinations and risky actions.",
    },
  },
  {
    slug: "planning-design",
    order: 7,
    folder: "07-planning-design",
    videoId: "kPfJ2BrBCMY",
    title: {
      es: "Patrón Planning",
      en: "Planning design pattern",
    },
    summary: {
      es: "Descomponer objetivos en pasos, replanificar y ejecutar con criterio.",
      en: "Break goals into steps, replan, and execute with intent.",
    },
  },
  {
    slug: "multi-agent",
    order: 8,
    folder: "08-multi-agent",
    videoId: "V6HpE9hZEx0",
    title: {
      es: "Multi-agente",
      en: "Multi-agent design pattern",
    },
    summary: {
      es: "Varios agentes especializados coordinados: handoffs, roles y conflictos.",
      en: "Specialized agents coordinated through handoffs, roles, and conflict handling.",
    },
  },
  {
    slug: "metacognition",
    order: 9,
    folder: "09-metacognition",
    videoId: "His9R6gw6Ec",
    title: {
      es: "Metacognición",
      en: "Metacognition design pattern",
    },
    summary: {
      es: "Auto-evaluación del agente: cuándo pedir ayuda, corregir o detenerse.",
      en: "Agent self-evaluation: when to ask for help, self-correct, or stop.",
    },
  },
  {
    slug: "production",
    order: 10,
    folder: "10-ai-agents-production",
    videoId: "l4TP6IyJxmQ",
    title: {
      es: "Agentes en producción",
      en: "AI agents in production",
    },
    summary: {
      es: "Observabilidad, costes, latencia, despliegue y operación de agentes reales.",
      en: "Observability, cost, latency, deployment, and operating real agents.",
    },
  },
  {
    slug: "agentic-protocols",
    order: 11,
    folder: "11-agentic-protocols",
    videoId: "X-Dh9R3Opn8",
    title: {
      es: "Protocolos agénticos (MCP, A2A, NLWeb)",
      en: "Agentic protocols (MCP, A2A, NLWeb)",
    },
    summary: {
      es: "Interoperabilidad entre agentes, herramientas y servicios con protocolos emergentes.",
      en: "Interoperability between agents, tools, and services via emerging protocols.",
    },
  },
  {
    slug: "context-engineering",
    order: 12,
    folder: "12-context-engineering",
    videoId: "F5zqRV7gEag",
    title: {
      es: "Ingeniería de contexto",
      en: "Context engineering",
    },
    summary: {
      es: "Qué entra en el prompt, ventanas, memoria de trabajo y priorización de señal.",
      en: "What goes in the prompt, windows, working memory, and signal prioritization.",
    },
  },
  {
    slug: "agent-memory",
    order: 13,
    folder: "13-agent-memory",
    videoId: "QrYbHesIxpw",
    title: {
      es: "Memoria agéntica",
      en: "Agentic memory",
    },
    summary: {
      es: "Memoria corta vs. larga, persistencia y cuándo olvidar.",
      en: "Short vs. long-term memory, persistence, and when to forget.",
    },
  },
  {
    slug: "microsoft-agent-framework",
    order: 14,
    folder: "14-microsoft-agent-framework",
    title: {
      es: "Microsoft Agent Framework",
      en: "Microsoft Agent Framework",
    },
    summary: {
      es: "Profundización en MAF: orquestación, tools y despliegue en Foundry.",
      en: "Deep dive into MAF: orchestration, tools, and Foundry deployment.",
    },
  },
  {
    slug: "browser-use",
    order: 15,
    folder: "15-browser-use",
    title: {
      es: "Computer Use Agents (CUA)",
      en: "Computer Use Agents (CUA)",
    },
    summary: {
      es: "Agentes que interactúan con el navegador y UIs como un usuario.",
      en: "Agents that interact with browsers and UIs like a human user.",
    },
  },
  {
    slug: "securing-ai-agents",
    order: 16,
    folder: "18-securing-ai-agents",
    title: {
      es: "Seguridad en agentes de IA",
      en: "Securing AI agents",
    },
    summary: {
      es: "Amenazas, permisos mínimos, validación de tool calls y hardening en prod.",
      en: "Threats, least privilege, tool-call validation, and production hardening.",
    },
  },
];

export function getLessonBySlug(slug: string): AiAgentsLesson | undefined {
  return AI_AGENTS_LESSONS.find((lesson) => lesson.slug === slug);
}

export function getAdjacentLessons(slug: string): {
  prev: AiAgentsLesson | undefined;
  next: AiAgentsLesson | undefined;
} {
  const index = AI_AGENTS_LESSONS.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) {
    return { prev: undefined, next: undefined };
  }
  return {
    prev: AI_AGENTS_LESSONS[index - 1],
    next: AI_AGENTS_LESSONS[index + 1],
  };
}
