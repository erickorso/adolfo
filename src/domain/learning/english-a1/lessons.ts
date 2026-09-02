import type { EnglishA1Lesson } from "./lesson.types";

export const ENGLISH_A1_LESSONS: EnglishA1Lesson[] = [
  {
    slug: "greetings",
    order: 0,
    title: { es: "Saludos", en: "Greetings" },
    summary: {
      es: "Hello, Hi, Good morning — lo básico para empezar.",
      en: "Hello, Hi, Good morning — the basics to get started.",
    },
    tip: {
      es: "En inglés informal decimos Hi; Hello es un poco más formal.",
      en: "In informal English we say Hi; Hello is a bit more formal.",
    },
  },
  {
    slug: "to-be-positive",
    order: 1,
    title: { es: "To be — afirmativo", en: "To be — affirmative" },
    summary: {
      es: "I am, You are, He/She/It is, We/They are.",
      en: "I am, You are, He/She/It is, We/They are.",
    },
    tip: {
      es: "Contracciones: I'm, You're, He's, She's, It's, We're, They're.",
      en: "Contractions: I'm, You're, He's, She's, It's, We're, They're.",
    },
  },
  {
    slug: "to-be-negative",
    order: 2,
    title: { es: "To be — negativo", en: "To be — negative" },
    summary: {
      es: "I'm not, You aren't, He isn't…",
      en: "I'm not, You aren't, He isn't…",
    },
    tip: {
      es: "Con I → I'm not (no *I amn't). Con he/she/it → isn't.",
      en: "With I → I'm not (not *I amn't). With he/she/it → isn't.",
    },
  },
  {
    slug: "to-be-questions",
    order: 3,
    title: { es: "To be — preguntas", en: "To be — questions" },
    summary: {
      es: "Am I? Are you? Is he? Short answers: Yes, I am / No, I'm not.",
      en: "Am I? Are you? Is he? Short answers: Yes, I am / No, I'm not.",
    },
    tip: {
      es: "En preguntas, el verbo va primero: Are you happy?",
      en: "In questions, the verb comes first: Are you happy?",
    },
  },
  {
    slug: "present-simple-affirmative",
    order: 4,
    title: { es: "Present simple — afirmativo", en: "Present simple — affirmative" },
    summary: {
      es: "I/You/We/They work. He/She/It works (+s en 3ª persona).",
      en: "I/You/We/They work. He/She/It works (+s in 3rd person).",
    },
    tip: {
      es: "He/She/It → verbo + s: She likes, He plays.",
      en: "He/She/It → verb + s: She likes, He plays.",
    },
  },
  {
    slug: "present-simple-questions",
    order: 5,
    title: { es: "Present simple — preguntas", en: "Present simple — questions" },
    summary: {
      es: "Do you like…? Does she play…?",
      en: "Do you like…? Does she play…?",
    },
    tip: {
      es: "Con Does, el verbo base sin -s: Does she like (no *likes).",
      en: "With Does, base verb without -s: Does she like (not *likes).",
    },
  },
  {
    slug: "review-mix",
    order: 6,
    title: { es: "Repaso", en: "Review" },
    summary: {
      es: "Mezcla de to be y present simple.",
      en: "Mix of to be and present simple.",
    },
    tip: {
      es: "Leé la frase entera antes de elegir — sujeto + tiempo verbal.",
      en: "Read the full sentence before choosing — subject + tense.",
    },
  },
];

export function getLessonBySlug(slug: string): EnglishA1Lesson | undefined {
  return ENGLISH_A1_LESSONS.find((l) => l.slug === slug);
}

export function getAdjacentLessons(slug: string): {
  prev: EnglishA1Lesson | null;
  next: EnglishA1Lesson | null;
} {
  const index = ENGLISH_A1_LESSONS.findIndex((l) => l.slug === slug);
  if (index < 0) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? ENGLISH_A1_LESSONS[index - 1]! : null,
    next:
      index < ENGLISH_A1_LESSONS.length - 1
        ? ENGLISH_A1_LESSONS[index + 1]!
        : null,
  };
}
