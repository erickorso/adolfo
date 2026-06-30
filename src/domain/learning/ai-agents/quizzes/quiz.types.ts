export type LocalizedText = { es: string; en: string };

export type QuizOption = {
  id: string;
  label: LocalizedText;
};

export type QuizQuestion = {
  id: string;
  prompt: LocalizedText;
  options: QuizOption[];
  correctOptionId: string;
  explanation: LocalizedText;
};

export type LessonQuizDefinition = {
  lessonSlug: string;
  questions: QuizQuestion[];
};

export type QuizQuestionPublic = {
  id: string;
  prompt: LocalizedText;
  options: QuizOption[];
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
