import type { LessonQuizDefinition } from "./quiz.types";

/** Quizzes alineados al repo microsoft/ai-agents-for-beginners (lecciones 0–4). */
export const AI_AGENTS_QUIZZES: LessonQuizDefinition[] = [
  {
    lessonSlug: "course-setup",
    questions: [
      {
        id: "setup-1",
        prompt: {
          es: "¿Qué stack principal usa este curso para los samples?",
          en: "What main stack does this course use for the samples?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Microsoft Agent Framework + Azure AI Foundry (Python)",
              en: "Microsoft Agent Framework + Azure AI Foundry (Python)",
            },
          },
          {
            id: "b",
            label: { es: "Solo React + Next.js", en: "React + Next.js only" },
          },
          {
            id: "c",
            label: { es: "Unity + C#", en: "Unity + C#" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "El curso usa MAF con Azure AI Foundry; los ejemplos corren en Python.",
          en: "The course uses MAF with Azure AI Foundry; samples run in Python.",
        },
      },
      {
        id: "setup-2",
        prompt: {
          es: "¿Qué deberías configurar antes de ejecutar los code_samples?",
          en: "What should you configure before running the code_samples?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Variables de entorno / credenciales de Azure o proveedor compatible",
              en: "Environment variables / Azure or compatible provider credentials",
            },
          },
          {
            id: "b",
            label: { es: "Un dominio propio en Vercel", en: "Your own Vercel domain" },
          },
          {
            id: "c",
            label: { es: "Solo instalar Node.js", en: "Install Node.js only" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "La lección 00-course-setup explica API keys y configuración del entorno.",
          en: "Lesson 00-course-setup covers API keys and environment setup.",
        },
      },
      {
        id: "setup-3",
        prompt: {
          es: "¿Dónde viven los ejercicios prácticos de cada lección?",
          en: "Where do the hands-on exercises for each lesson live?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Carpeta code_samples dentro de cada lección en GitHub",
              en: "The code_samples folder inside each lesson on GitHub",
            },
          },
          {
            id: "b",
            label: { es: "Solo en YouTube", en: "Only on YouTube" },
          },
          {
            id: "c",
            label: { es: "En npm registry", en: "On the npm registry" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Cada carpeta del repo incluye README + code_samples.",
          en: "Each repo folder includes README + code_samples.",
        },
      },
    ],
  },
  {
    lessonSlug: "intro-to-ai-agents",
    questions: [
      {
        id: "intro-1",
        prompt: {
          es: "¿Qué puede hacer un agente que un chatbot básico no hace solo?",
          en: "What can an agent do that a basic chatbot cannot do alone?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Usar herramientas, planificar pasos y actuar sobre sistemas externos",
              en: "Use tools, plan steps, and act on external systems",
            },
          },
          {
            id: "b",
            label: {
              es: "Solo responder con texto memorizado",
              en: "Only reply with memorized text",
            },
          },
          {
            id: "c",
            label: { es: "Renderizar HTML estático", en: "Render static HTML" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Los agentes combinan razonamiento con acciones vía tools y flujos multi-paso.",
          en: "Agents combine reasoning with actions via tools and multi-step flows.",
        },
      },
      {
        id: "intro-2",
        prompt: {
          es: "En el demo del STUDY_GUIDE, ¿qué hace el “course helper agent”?",
          en: "In the STUDY_GUIDE demo, what does the “course helper agent” do?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Busca lecciones, resume y propone una tarea práctica",
              en: "Finds lessons, summarizes, and suggests a practice task",
            },
          },
          {
            id: "b",
            label: { es: "Solo traduce el README", en: "Only translates the README" },
          },
          {
            id: "c",
            label: { es: "Despliega en Azure automáticamente", en: "Auto-deploys to Azure" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "El agente ayudante ilustra tools, RAG, planning y contexto.",
          en: "The helper agent illustrates tools, RAG, planning, and context.",
        },
      },
      {
        id: "intro-3",
        prompt: {
          es: "¿Cuándo conviene un flujo agéntico frente a un chat simple?",
          en: "When is an agentic flow better than a simple chat?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Cuando hace falta recuperar datos, ejecutar acciones o varios pasos",
              en: "When you need retrieval, actions, or multiple steps",
            },
          },
          {
            id: "b",
            label: { es: "Siempre, sin excepción", en: "Always, without exception" },
          },
          {
            id: "c",
            label: {
              es: "Nunca; los chats son siempre mejores",
              en: "Never; chats are always better",
            },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Los agentes aportan valor cuando el objetivo requiere herramientas o orquestación.",
          en: "Agents add value when the goal needs tools or orchestration.",
        },
      },
    ],
  },
  {
    lessonSlug: "agentic-frameworks",
    questions: [
      {
        id: "fw-1",
        prompt: {
          es: "¿Para qué sirve un framework agéntico?",
          en: "What is an agentic framework for?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Orquestar modelos, tools, estado y workflows de forma mantenible",
              en: "Orchestrate models, tools, state, and workflows maintainably",
            },
          },
          {
            id: "b",
            label: { es: "Reemplazar la base de datos", en: "Replace the database" },
          },
          {
            id: "c",
            label: { es: "Compilar CSS", en: "Compile CSS" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Los frameworks abstraen piezas repetitivas del ciclo agente.",
          en: "Frameworks abstract repetitive parts of the agent loop.",
        },
      },
      {
        id: "fw-2",
        prompt: {
          es: "¿Qué framework promueve este curso de Microsoft?",
          en: "Which framework does this Microsoft course promote?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Microsoft Agent Framework (MAF)",
              en: "Microsoft Agent Framework (MAF)",
            },
          },
          {
            id: "b",
            label: { es: "Django REST", en: "Django REST" },
          },
          {
            id: "c",
            label: { es: "Tailwind CSS", en: "Tailwind CSS" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "MAF es el stack central junto con Azure AI Foundry Agent Service.",
          en: "MAF is the core stack alongside Azure AI Foundry Agent Service.",
        },
      },
      {
        id: "fw-3",
        prompt: {
          es: "Al elegir framework, ¿qué partes del demo deberías mapear primero?",
          en: "When choosing a framework, what demo parts should you map first?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Modelo, tools, estado y pasos del workflow",
              en: "Model, tools, state, and workflow steps",
            },
          },
          {
            id: "b",
            label: { es: "Solo el favicon", en: "Only the favicon" },
          },
          {
            id: "c",
            label: { es: "El color del botón", en: "The button color" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "La lección 02 pide identificar qué gestionaría el framework en tu agente.",
          en: "Lesson 02 asks you to identify what the framework would manage.",
        },
      },
    ],
  },
  {
    lessonSlug: "design-patterns",
    questions: [
      {
        id: "pat-1",
        prompt: {
          es: "¿Qué cubren los patrones de diseño agéntico?",
          en: "What do agentic design patterns cover?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Roles, estado, herramientas y límites del agente",
              en: "Agent roles, state, tools, and boundaries",
            },
          },
          {
            id: "b",
            label: { es: "Solo tipografía web", en: "Web typography only" },
          },
          {
            id: "c",
            label: { es: "Configuración de DNS", en: "DNS configuration" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Los patrones ayudan a diseñar agentes mantenibles antes de codificar.",
          en: "Patterns help design maintainable agents before coding.",
        },
      },
      {
        id: "pat-2",
        prompt: {
          es: "Según el STUDY_GUIDE, ¿qué deberías hacer después de la lección 03?",
          en: "Per the STUDY_GUIDE, what should you do after lesson 03?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Esquematizar el user journey antes de escribir código",
              en: "Sketch the user journey before writing code",
            },
          },
          {
            id: "b",
            label: { es: "Saltar directo a producción", en: "Jump straight to production" },
          },
          {
            id: "c",
            label: { es: "Borrar todos los tests", en: "Delete all tests" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Diseñar el recorrido reduce deuda en flujos agénticos complejos.",
          en: "Designing the journey reduces debt in complex agentic flows.",
        },
      },
      {
        id: "pat-3",
        prompt: {
          es: "¿Cuál es un buen primer paso al aprender patrones?",
          en: "What is a good first step when learning patterns?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Elegir un patrón acorde al problema (tool use, RAG, planning…)",
              en: "Pick a pattern that fits the problem (tool use, RAG, planning…)",
            },
          },
          {
            id: "b",
            label: { es: "Usar todos los patrones a la vez", en: "Use every pattern at once" },
          },
          {
            id: "c",
            label: { es: "Evitar cualquier patrón", en: "Avoid any pattern" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Cada patrón resuelve un tipo de capacidad distinta del agente.",
          en: "Each pattern solves a different agent capability.",
        },
      },
    ],
  },
  {
    lessonSlug: "tool-use",
    questions: [
      {
        id: "tool-1",
        prompt: {
          es: "¿Qué es una “tool” en un agente?",
          en: "What is a “tool” in an agent?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Función/API/servicio invocable con inputs tipados y salida predecible",
              en: "A callable function/API/service with typed inputs and predictable output",
            },
          },
          {
            id: "b",
            label: { es: "Un emoji en el chat", en: "An emoji in the chat" },
          },
          {
            id: "c",
            label: { es: "Un archivo CSS", en: "A CSS file" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Las tools extienden al modelo más allá del texto generado.",
          en: "Tools extend the model beyond generated text.",
        },
      },
      {
        id: "tool-2",
        prompt: {
          es: "Ejemplo de tool para el demo “course helper”:",
          en: "Example tool for the “course helper” demo:",
        },
        options: [
          {
            id: "a",
            label: {
              es: "search_lessons(query) o read_lesson(path)",
              en: "search_lessons(query) or read_lesson(path)",
            },
          },
          {
            id: "b",
            label: { es: "delete_database()", en: "delete_database()" },
          },
          {
            id: "c",
            label: { es: "format_usb_drive()", en: "format_usb_drive()" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Tools de búsqueda/lectura encajan con recuperar material del curso.",
          en: "Search/read tools fit retrieving course material.",
        },
      },
      {
        id: "tool-3",
        prompt: {
          es: "¿Qué hace el patrón Tool Use?",
          en: "What does the Tool Use pattern do?",
        },
        options: [
          {
            id: "a",
            label: {
              es: "Permite al agente invocar APIs/funciones para obtener datos o actuar",
              en: "Lets the agent call APIs/functions to fetch data or take action",
            },
          },
          {
            id: "b",
            label: {
              es: "Desactiva toda conexión externa",
              en: "Disables all external connections",
            },
          },
          {
            id: "c",
            label: { es: "Solo cambia el tema oscuro", en: "Only toggles dark mode" },
          },
        ],
        correctOptionId: "a",
        explanation: {
          es: "Lección 04 — el agente elige cuándo y qué tool llamar.",
          en: "Lesson 04 — the agent chooses when and which tool to call.",
        },
      },
    ],
  },
];

export function getQuizByLessonSlug(
  lessonSlug: string,
): LessonQuizDefinition | undefined {
  return AI_AGENTS_QUIZZES.find((quiz) => quiz.lessonSlug === lessonSlug);
}

export function getQuizSlugsWithQuiz(): string[] {
  return AI_AGENTS_QUIZZES.map((quiz) => quiz.lessonSlug);
}
