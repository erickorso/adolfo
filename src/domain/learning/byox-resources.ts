/** Recursos externos "Build Your Own X" — enlaces curados (ver jobs/build-your-own-x-resources.md). */

export const BUILD_YOUR_OWN_X_REPO =
  "https://github.com/codecrafters-io/build-your-own-x";

export const BUILD_YOUR_OWN_X_WEB = "https://build-your-own-x.vercel.app";

export type ByoxResource = {
  id: string;
  href: string;
  title: { es: string; en: string };
  blurb: { es: string; en: string };
};

/** Deep dives alineados a full-stack + analytics (Mediastream prep). */
export const BYOX_FULLSTACK_PICKS: ByoxResource[] = [
  {
    id: "database",
    href: "https://cstack.github.io/db_tutorial/",
    title: {
      es: "Construí una base de datos simple",
      en: "Let's Build a Simple Database",
    },
    blurb: {
      es: "SQL, índices y almacenamiento — base para Postgres analítico.",
      en: "SQL, indexes, and storage — foundation for analytics Postgres.",
    },
  },
  {
    id: "redis",
    href: "https://build-your-own.org/redis",
    title: {
      es: "Construí Redis desde cero",
      en: "Build Your Own Redis",
    },
    blurb: {
      es: "Cache, colas y pub/sub — analogía a pipelines en tiempo real.",
      en: "Cache, queues, pub/sub — analogy to real-time pipelines.",
    },
  },
  {
    id: "kafka",
    href: "https://github.com/buildthingsuseful/build-your-own-kafka",
    title: {
      es: "Sistema tipo Kafka desde cero",
      en: "Kafka-like System from Scratch",
    },
    blurb: {
      es: "Topics, consumers e ingesta de eventos a escala.",
      en: "Topics, consumers, and event ingestion at scale.",
    },
  },
  {
    id: "webserver-js",
    href: "https://build-your-own.org/webserver/",
    title: {
      es: "Web server en JavaScript",
      en: "Web Server from Scratch (JavaScript)",
    },
    blurb: {
      es: "HTTP y APIs Node sin framework — complemento a Next.js.",
      en: "HTTP and Node APIs without a framework — beyond Next.js.",
    },
  },
  {
    id: "webserver-py",
    href: "https://ruslanspivak.com/lsbaws-part1/",
    title: {
      es: "Web server en Python (LSBAWS)",
      en: "Let's Build A Web Server (Python)",
    },
    blurb: {
      es: "Fundamentos HTTP clásicos — útil para explicar en entrevista.",
      en: "Classic HTTP fundamentals — great for interview explanations.",
    },
  },
];

/** Opcional para el path de agentes (RAG / LLM). */
export const BYOX_AI_PICKS: ByoxResource[] = [
  {
    id: "rag",
    href: "https://github.com/langchain-ai/rag-from-scratch",
    title: {
      es: "RAG from Scratch",
      en: "RAG from Scratch",
    },
    blurb: {
      es: "Embeddings, retrieval e indexado — extiende la lección de RAG agéntico.",
      en: "Embeddings, retrieval, indexing — extends the agentic RAG lesson.",
    },
  },
];

export function byoxLocalizedText(
  locale: string,
  text: { es: string; en: string },
): string {
  return locale === "es" ? text.es : text.en;
}
