import type { QuizOption } from "@/domain/learning/ai-agents/quizzes/quiz.types";

export const REACT_LOOP_ITEMS: QuizOption[] = [
  {
    id: "reason",
    label: {
      es: "Reason — el modelo piensa el siguiente paso",
      en: "Reason — the model thinks the next step",
    },
  },
  {
    id: "act",
    label: {
      es: "Act — invoca una tool o acción externa",
      en: "Act — invokes a tool or external action",
    },
  },
  {
    id: "observe",
    label: {
      es: "Observe — incorpora el resultado al contexto",
      en: "Observe — incorporates the result into context",
    },
  },
];

export const REACT_LOOP_ORDER = ["reason", "act", "observe"];
