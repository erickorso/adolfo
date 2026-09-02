import type { EnglishA1Exercise, ExerciseScoreResult } from "./exercise.types";
import { getExerciseById } from "./exercises";

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreChoice(
  exercise: Extract<EnglishA1Exercise, { type: "choice" }>,
  answer: string,
): ExerciseScoreResult {
  const normalized = answer.trim();
  return {
    correct: normalized === exercise.correctOptionId,
    normalizedAnswer: normalized,
    explanation: exercise.explanation,
  };
}

function scoreFillBlank(
  exercise: Extract<EnglishA1Exercise, { type: "fill-blank" }>,
  answer: string,
): ExerciseScoreResult {
  const normalized = normalizeText(answer);
  const accepted = exercise.acceptedAnswers.map(normalizeText);
  return {
    correct: accepted.includes(normalized),
    normalizedAnswer: normalized,
    explanation: exercise.explanation,
  };
}

function scoreWordBank(
  exercise: Extract<EnglishA1Exercise, { type: "word-bank" }>,
  answer: string,
): ExerciseScoreResult {
  const parts = answer
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  const correct =
    parts.length === exercise.correctOrder.length &&
    parts.every((part, i) => part === exercise.correctOrder[i]);
  return {
    correct,
    normalizedAnswer: parts.join("|"),
    explanation: exercise.explanation,
  };
}

export function scoreExerciseAnswer(
  exerciseId: string,
  answer: string,
): ExerciseScoreResult | null {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) {
    return null;
  }

  switch (exercise.type) {
    case "choice":
      return scoreChoice(exercise, answer);
    case "fill-blank":
      return scoreFillBlank(exercise, answer);
    case "word-bank":
      return scoreWordBank(exercise, answer);
    default:
      return null;
  }
}

export function serializeWordBankOrder(words: string[]): string {
  return words.join("|");
}
