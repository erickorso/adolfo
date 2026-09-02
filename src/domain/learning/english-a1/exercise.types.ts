import type { LocalizedText } from "./lesson.types";

export type ChoiceExercise = {
  id: string;
  type: "choice";
  prompt: LocalizedText;
  options: { id: string; text: LocalizedText }[];
  correctOptionId: string;
  explanation?: LocalizedText;
};

export type FillBlankExercise = {
  id: string;
  type: "fill-blank";
  prompt: LocalizedText;
  acceptedAnswers: string[];
  explanation?: LocalizedText;
};

export type WordBankExercise = {
  id: string;
  type: "word-bank";
  prompt: LocalizedText;
  words: string[];
  correctOrder: string[];
  explanation?: LocalizedText;
};

export type EnglishA1Exercise =
  | ChoiceExercise
  | FillBlankExercise
  | WordBankExercise;

export type ExerciseScoreResult = {
  correct: boolean;
  normalizedAnswer: string;
  explanation?: LocalizedText;
};
