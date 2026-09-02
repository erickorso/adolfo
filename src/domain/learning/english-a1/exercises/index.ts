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
    prompt: {
      es: "¿Cuándo usamos present simple?",
      en: "When do we use present simple?",
    },
    options: [
      { id: "a", text: { es: "Hábitos y rutinas", en: "Habits and routines" } },
      { id: "b", text: { es: "Solo ayer", en: "Only yesterday" } },
      { id: "c", text: { es: "Solo mañana", en: "Only tomorrow" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-aff-2",
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
    id: "ps-aff-3",
    type: "fill-blank",
    prompt: { es: "They ___ football on Sundays.", en: "They ___ football on Sundays." },
    acceptedAnswers: ["play"],
  },
  {
    id: "ps-aff-4",
    type: "choice",
    prompt: {
      es: "Palabra clave del present simple:",
      en: "Present simple signal word:",
    },
    options: [
      { id: "a", text: { es: "every day", en: "every day" } },
      { id: "b", text: { es: "yesterday", en: "yesterday" } },
      { id: "c", text: { es: "now", en: "now" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-aff-5",
    type: "word-bank",
    prompt: { es: "Armá: The Sun rises in the east", en: "Build: The Sun rises in the east" },
    words: ["Sun", "The", "east", "in", "rises", "the"],
    correctOrder: ["The", "Sun", "rises", "in", "the", "east"],
  },
];

const PRESENT_SIMPLE_NEGATIVE: EnglishA1Exercise[] = [
  {
    id: "ps-neg-1",
    type: "choice",
    prompt: { es: "I ___ like spinach.", en: "I ___ like spinach." },
    options: [
      { id: "a", text: { es: "don't", en: "don't" } },
      { id: "b", text: { es: "doesn't", en: "doesn't" } },
      { id: "c", text: { es: "isn't", en: "isn't" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-neg-2",
    type: "fill-blank",
    prompt: { es: "She ___ watch TV.", en: "She ___ watch TV." },
    acceptedAnswers: ["doesn't", "does not"],
  },
  {
    id: "ps-neg-3",
    type: "choice",
    prompt: {
      es: "Correcto: She doesn't like broccoli.",
      en: "Correct: She doesn't like broccoli.",
    },
    options: [
      { id: "a", text: { es: "Sí — doesn't + verbo base", en: "Yes — doesn't + base verb" } },
      { id: "b", text: { es: "No — debe ser doesn't likes", en: "No — should be doesn't likes" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-neg-4",
    type: "word-bank",
    prompt: { es: "Armá: They don't play tennis", en: "Build: They don't play tennis" },
    words: ["don't", "They", "tennis", "play"],
    correctOrder: ["They", "don't", "play", "tennis"],
  },
];

const PRESENT_SIMPLE_SPELLING: EnglishA1Exercise[] = [
  {
    id: "ps-sp-1",
    type: "fill-blank",
    prompt: { es: "He ___ (watch) TV every evening.", en: "He ___ (watch) TV every evening." },
    acceptedAnswers: ["watches"],
  },
  {
    id: "ps-sp-2",
    type: "fill-blank",
    prompt: { es: "She ___ (study) English.", en: "She ___ (study) English." },
    acceptedAnswers: ["studies"],
  },
  {
    id: "ps-sp-3",
    type: "choice",
    prompt: { es: "He ___ a bike.", en: "He ___ a bike." },
    options: [
      { id: "a", text: { es: "has", en: "has" } },
      { id: "b", text: { es: "have", en: "have" } },
      { id: "c", text: { es: "haves", en: "haves" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-sp-4",
    type: "fill-blank",
    prompt: { es: "She ___ (go) to school by bus.", en: "She ___ (go) to school by bus." },
    acceptedAnswers: ["goes"],
  },
  {
    id: "ps-sp-5",
    type: "choice",
    prompt: {
      es: "¿Quién lleva -s en present simple?",
      en: "Who takes -s in present simple?",
    },
    options: [
      { id: "a", text: { es: "he / she / it", en: "he / she / it" } },
      { id: "b", text: { es: "solo I", en: "only I" } },
      { id: "c", text: { es: "todos igual", en: "everyone the same" } },
    ],
    correctOptionId: "a",
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
    prompt: {
      es: "Do you go to school by bus? — Yes, ___",
      en: "Do you go to school by bus? — Yes, ___",
    },
    options: [
      { id: "a", text: { es: "I do", en: "I do" } },
      { id: "b", text: { es: "I am", en: "I am" } },
      { id: "c", text: { es: "she does", en: "she does" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-q-4",
    type: "choice",
    prompt: {
      es: "Does she play the piano? — No, she ___",
      en: "Does she play the piano? — No, she ___",
    },
    options: [
      { id: "a", text: { es: "doesn't", en: "doesn't" } },
      { id: "b", text: { es: "don't", en: "don't" } },
      { id: "c", text: { es: "isn't", en: "isn't" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "ps-q-5",
    type: "word-bank",
    prompt: { es: "Armá: Do they live here?", en: "Build: Do they live here?" },
    words: ["they", "Do", "here?", "live"],
    correctOrder: ["Do", "they", "live", "here?"],
  },
];

const PRESENT_SIMPLE_WH: EnglishA1Exercise[] = [
  {
    id: "ps-wh-1",
    type: "word-bank",
    prompt: {
      es: "Armá: Where do you go to school?",
      en: "Build: Where do you go to school?",
    },
    words: ["you", "Where", "school?", "do", "go", "to"],
    correctOrder: ["Where", "do", "you", "go", "to", "school?"],
  },
  {
    id: "ps-wh-2",
    type: "word-bank",
    prompt: { es: "Armá: What do you do?", en: "Build: What do you do?" },
    words: ["What", "you", "do?", "do"],
    correctOrder: ["What", "do", "you", "do?"],
  },
  {
    id: "ps-wh-3",
    type: "word-bank",
    prompt: { es: "Armá: When do you get up?", en: "Build: When do you get up?" },
    words: ["get", "When", "up?", "you", "do"],
    correctOrder: ["When", "do", "you", "get", "up?"],
  },
  {
    id: "ps-wh-4",
    type: "word-bank",
    prompt: {
      es: "Armá: Why do you eat so much chocolate?",
      en: "Build: Why do you eat so much chocolate?",
    },
    words: ["you", "Why", "chocolate?", "do", "eat", "much", "so"],
    correctOrder: ["Why", "do", "you", "eat", "so", "much", "chocolate?"],
  },
  {
    id: "ps-wh-5",
    type: "word-bank",
    prompt: {
      es: "Armá: Who does she meet on Saturdays?",
      en: "Build: Who does she meet on Saturdays?",
    },
    words: ["Saturdays?", "Who", "she", "on", "does", "meet"],
    correctOrder: ["Who", "does", "she", "meet", "on", "Saturdays?"],
  },
  {
    id: "ps-wh-6",
    type: "word-bank",
    prompt: {
      es: "Armá: Which colour do you prefer?",
      en: "Build: Which colour do you prefer?",
    },
    words: ["you", "Which", "prefer?", "colour", "do"],
    correctOrder: ["Which", "colour", "do", "you", "prefer?"],
  },
  {
    id: "ps-wh-7",
    type: "word-bank",
    prompt: {
      es: "Armá: How do you cook pasta?",
      en: "Build: How do you cook pasta?",
    },
    words: ["you", "How", "pasta?", "cook", "do"],
    correctOrder: ["How", "do", "you", "cook", "pasta?"],
  },
  {
    id: "ps-wh-8",
    type: "word-bank",
    prompt: {
      es: "Armá: Where do you play tennis?",
      en: "Build: Where do you play tennis?",
    },
    words: ["you", "Where", "tennis?", "play", "do"],
    correctOrder: ["Where", "do", "you", "play", "tennis?"],
  },
];

const REVIEW_MIX: EnglishA1Exercise[] = [
  {
    id: "rev-1",
    type: "choice",
    prompt: { es: "Water ___ at 100°C.", en: "Water ___ at 100°C." },
    options: [
      { id: "a", text: { es: "boils", en: "boils" } },
      { id: "b", text: { es: "is boiling", en: "is boiling" } },
      { id: "c", text: { es: "boiled", en: "boiled" } },
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
    prompt: {
      es: "Where ___ you play tennis?",
      en: "Where ___ you play tennis?",
    },
    options: [
      { id: "a", text: { es: "do", en: "do" } },
      { id: "b", text: { es: "does", en: "does" } },
      { id: "c", text: { es: "are", en: "are" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "rev-6",
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
  "present-simple-negative": PRESENT_SIMPLE_NEGATIVE,
  "present-simple-spelling": PRESENT_SIMPLE_SPELLING,
  "present-simple-questions": PRESENT_SIMPLE_Q,
  "present-simple-wh-questions": PRESENT_SIMPLE_WH,
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
