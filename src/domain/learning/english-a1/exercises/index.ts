import type { EnglishA1Exercise } from "../exercise.types";

const GREETINGS_EXERCISES: EnglishA1Exercise[] = [
  {
    id: "greet-1",
    type: "choice",
    prompt: { es: "¿Cómo saludás por la mañana?", en: "How do you greet in the morning?" },
    options: [
      { id: "a", text: { es: "Good morning", en: "Good morning" } },
      { id: "b", text: { es: "Good night", en: "Good night" } },
      { id: "c", text: { es: "Goodbye", en: "Goodbye" } },
    ],
    correctOptionId: "a",
    explanation: {
      es: "Good morning = buenos días (mañana).",
      en: "Good morning = morning greeting.",
    },
  },
  {
    id: "greet-2",
    type: "fill-blank",
    prompt: { es: "Hello, I ___ Rodrigo.", en: "Hello, I ___ Rodrigo." },
    acceptedAnswers: ["am", "am rodri", "'m", "m"],
    explanation: {
      es: "I am = yo soy.",
      en: "I am = yo soy / I am.",
    },
  },
  {
    id: "greet-3",
    type: "choice",
    prompt: { es: "Saludo informal:", en: "Informal greeting:" },
    options: [
      { id: "a", text: { es: "Hi!", en: "Hi!" } },
      { id: "b", text: { es: "Good evening, sir", en: "Good evening, sir" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "greet-4",
    type: "word-bank",
    prompt: { es: "Armá: Nice to meet you", en: "Build: Nice to meet you" },
    words: ["you", "Nice", "meet", "to"],
    correctOrder: ["Nice", "to", "meet", "you"],
  },
];

const TO_BE_POSITIVE: EnglishA1Exercise[] = [
  {
    id: "tb-pos-1",
    type: "choice",
    prompt: { es: "She ___ happy.", en: "She ___ happy." },
    options: [
      { id: "a", text: { es: "is", en: "is" } },
      { id: "b", text: { es: "are", en: "are" } },
      { id: "c", text: { es: "am", en: "am" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-pos-2",
    type: "fill-blank",
    prompt: { es: "We ___ students.", en: "We ___ students." },
    acceptedAnswers: ["are", "'re"],
  },
  {
    id: "tb-pos-3",
    type: "choice",
    prompt: { es: "I ___ from Spain.", en: "I ___ from Spain." },
    options: [
      { id: "a", text: { es: "am", en: "am" } },
      { id: "b", text: { es: "is", en: "is" } },
      { id: "c", text: { es: "are", en: "are" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-pos-4",
    type: "word-bank",
    prompt: { es: "Armá: They are friends", en: "Build: They are friends" },
    words: ["are", "They", "friends"],
    correctOrder: ["They", "are", "friends"],
  },
];

const TO_BE_NEGATIVE: EnglishA1Exercise[] = [
  {
    id: "tb-neg-1",
    type: "choice",
    prompt: { es: "He ___ tired.", en: "He ___ tired." },
    options: [
      { id: "a", text: { es: "isn't", en: "isn't" } },
      { id: "b", text: { es: "aren't", en: "aren't" } },
      { id: "c", text: { es: "am not", en: "am not" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-neg-2",
    type: "fill-blank",
    prompt: { es: "I ___ hungry. (negativo)", en: "I ___ hungry. (negative)" },
    acceptedAnswers: ["am not", "'m not", "amn't"],
  },
  {
    id: "tb-neg-3",
    type: "choice",
    prompt: { es: "We ___ late.", en: "We ___ late." },
    options: [
      { id: "a", text: { es: "aren't", en: "aren't" } },
      { id: "b", text: { es: "isn't", en: "isn't" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-neg-4",
    type: "word-bank",
    prompt: { es: "Armá: She is not here", en: "Build: She is not here" },
    words: ["not", "She", "is", "here"],
    correctOrder: ["She", "is", "not", "here"],
  },
];

const TO_BE_QUESTIONS: EnglishA1Exercise[] = [
  {
    id: "tb-q-1",
    type: "choice",
    prompt: { es: "___ you OK?", en: "___ you OK?" },
    options: [
      { id: "a", text: { es: "Are", en: "Are" } },
      { id: "b", text: { es: "Is", en: "Is" } },
      { id: "c", text: { es: "Am", en: "Am" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-q-2",
    type: "fill-blank",
    prompt: { es: "___ he your brother?", en: "___ he your brother?" },
    acceptedAnswers: ["is"],
  },
  {
    id: "tb-q-3",
    type: "choice",
    prompt: { es: "Respuesta corta: Are you ready? — Yes, ___", en: "Short answer: Are you ready? — Yes, ___" },
    options: [
      { id: "a", text: { es: "I am", en: "I am" } },
      { id: "b", text: { es: "you are", en: "you are" } },
      { id: "c", text: { es: "he is", en: "he is" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "tb-q-4",
    type: "word-bank",
    prompt: { es: "Armá: Am I late?", en: "Build: Am I late?" },
    words: ["I", "Am", "late?"],
    correctOrder: ["Am", "I", "late?"],
  },
];

const PRESENT_SIMPLE_AFF: EnglishA1Exercise[] = [
  {
    id: "ps-aff-1",
    type: "choice",
    prompt: { es: "She ___ English.", en: "She ___ English." },
    options: [
      { id: "a", text: { es: "likes", en: "likes" } },
      { id: "b", text: { es: "like", en: "like" } },
      { id: "c", text: { es: "liking", en: "liking" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-aff-2",
    type: "fill-blank",
    prompt: { es: "They ___ football on Sundays.", en: "They ___ football on Sundays." },
    acceptedAnswers: ["play"],
  },
  {
    id: "ps-aff-3",
    type: "choice",
    prompt: { es: "He ___ to school by bus.", en: "He ___ to school by bus." },
    options: [
      { id: "a", text: { es: "goes", en: "goes" } },
      { id: "b", text: { es: "go", en: "go" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-aff-4",
    type: "word-bank",
    prompt: { es: "Armá: I like pizza", en: "Build: I like pizza" },
    words: ["pizza", "like", "I"],
    correctOrder: ["I", "like", "pizza"],
  },
];

const PRESENT_SIMPLE_Q: EnglishA1Exercise[] = [
  {
    id: "ps-q-1",
    type: "choice",
    prompt: { es: "___ you like music?", en: "___ you like music?" },
    options: [
      { id: "a", text: { es: "Do", en: "Do" } },
      { id: "b", text: { es: "Does", en: "Does" } },
      { id: "c", text: { es: "Is", en: "Is" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-q-2",
    type: "fill-blank",
    prompt: { es: "___ she speak Spanish?", en: "___ she speak Spanish?" },
    acceptedAnswers: ["does"],
  },
  {
    id: "ps-q-3",
    type: "choice",
    prompt: { es: "Does he play tennis? — No, he ___", en: "Does he play tennis? — No, he ___" },
    options: [
      { id: "a", text: { es: "doesn't", en: "doesn't" } },
      { id: "b", text: { es: "don't", en: "don't" } },
      { id: "c", text: { es: "isn't", en: "isn't" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-q-4",
    type: "word-bank",
    prompt: { es: "Armá: Do they live here?", en: "Build: Do they live here?" },
    words: ["they", "Do", "here?", "live"],
    correctOrder: ["Do", "they", "live", "here?"],
  },
];

const REVIEW_MIX: EnglishA1Exercise[] = [
  {
    id: "rev-1",
    type: "choice",
    prompt: { es: "I ___ 8 years old.", en: "I ___ 8 years old." },
    options: [
      { id: "a", text: { es: "am", en: "am" } },
      { id: "b", text: { es: "have", en: "have" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "rev-2",
    type: "fill-blank",
    prompt: { es: "My dad ___ coffee every morning.", en: "My dad ___ coffee every morning." },
    acceptedAnswers: ["drinks", "has"],
  },
  {
    id: "rev-3",
    type: "choice",
    prompt: { es: "___ we late?", en: "___ we late?" },
    options: [
      { id: "a", text: { es: "Are", en: "Are" } },
      { id: "b", text: { es: "Do", en: "Do" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "rev-4",
    type: "word-bank",
    prompt: { es: "Armá: She doesn't like fish", en: "Build: She doesn't like fish" },
    words: ["like", "fish", "doesn't", "She"],
    correctOrder: ["She", "doesn't", "like", "fish"],
  },
  {
    id: "rev-5",
    type: "choice",
    prompt: { es: "They ___ at home now.", en: "They ___ at home now." },
    options: [
      { id: "a", text: { es: "are", en: "are" } },
      { id: "b", text: { es: "is", en: "is" } },
    ],
    correctOptionId: "a",
  },
];

const EXERCISES_BY_LESSON: Record<string, EnglishA1Exercise[]> = {
  greetings: GREETINGS_EXERCISES,
  "to-be-positive": TO_BE_POSITIVE,
  "to-be-negative": TO_BE_NEGATIVE,
  "to-be-questions": TO_BE_QUESTIONS,
  "present-simple-affirmative": PRESENT_SIMPLE_AFF,
  "present-simple-questions": PRESENT_SIMPLE_Q,
  "review-mix": REVIEW_MIX,
};

const ALL_EXERCISES = Object.values(EXERCISES_BY_LESSON).flat();

export function getExercisesForLesson(lessonSlug: string): EnglishA1Exercise[] {
  return EXERCISES_BY_LESSON[lessonSlug] ?? [];
}

export function getExerciseById(exerciseId: string): EnglishA1Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.id === exerciseId);
}

export function getLessonSlugForExercise(exerciseId: string): string | null {
  for (const [slug, exercises] of Object.entries(EXERCISES_BY_LESSON)) {
    if (exercises.some((e) => e.id === exerciseId)) {
      return slug;
    }
  }
  return null;
}
