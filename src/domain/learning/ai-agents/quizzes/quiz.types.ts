export type LocalizedText = { es: string; en: string };

export type QuizOption = {
  id: string;
  label: LocalizedText;
};

export type QuizQuestionChoice = {
  type?: "choice";
  id: string;
  prompt: LocalizedText;
  options: QuizOption[];
  correctOptionId: string;
  explanation: LocalizedText;
};

export type QuizQuestionOrder = {
  type: "order";
  id: string;
  prompt: LocalizedText;
  items: QuizOption[];
  correctOrder: string[];
  explanation: LocalizedText;
};

export type QuizQuestion = QuizQuestionChoice | QuizQuestionOrder;

export type QuizQuestionPublicChoice = {
  type: "choice";
  id: string;
  prompt: LocalizedText;
  options: QuizOption[];
};

export type QuizQuestionPublicOrder = {
  type: "order";
  id: string;
  prompt: LocalizedText;
  items: QuizOption[];
};

export type QuizQuestionPublic =
  | QuizQuestionPublicChoice
  | QuizQuestionPublicOrder;

export type LessonQuizDefinition = {
  lessonSlug: string;
  questions: QuizQuestion[];
};

export type LessonQuizPublic = {
  lessonSlug: string;
  passPercent: number;
  questions: QuizQuestionPublic[];
};

export type QuizSubmitResult = {
  score: number;
  passed: boolean;
  correctCount: number;
  total: number;
  xpAwarded: number;
  results: Array<{
    questionId: string;
    correct: boolean;
    explanation: LocalizedText;
  }>;
};

export function isOrderQuestion(
  question: QuizQuestion | QuizQuestionPublic,
): question is QuizQuestionOrder | QuizQuestionPublicOrder {
  return question.type === "order";
}

export function isChoiceQuestion(
  question: QuizQuestion | QuizQuestionPublic,
): question is QuizQuestionChoice | QuizQuestionPublicChoice {
  return question.type !== "order";
}
