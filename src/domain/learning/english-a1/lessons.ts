import type { EnglishA1Lesson } from "./lesson.types";

/**
 * Alineado con ficha del cole (Present Simple · to be · wh-questions).
 * PDF ref: img20260902_18332024.pdf
 */
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
    grammar: {
      es: "Hello / Hi · Good morning · Good afternoon · Good night\nPlease · Thank you · You're welcome · Sorry\nNice to meet you!",
      en: "Hello / Hi · Good morning · Good afternoon · Good night\nPlease · Thank you · You're welcome · Sorry\nNice to meet you!",
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
    grammar: {
      es: "AFIRMATIVO\nI am · You are · He/She/It is · We/You/They are\n\nEjemplos del cole:\nI'm active · You're serious · He's shy · We're talkative",
      en: "AFFIRMATIVE\nI am · You are · He/She/It is · We/You/They are\n\nSchool examples:\nI'm active · You're serious · He's shy · We're talkative",
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
    grammar: {
      es: "NEGATIVO\nI'm not · You aren't · He/She/It isn't · We/You/They aren't\n\nEjemplo: She isn't at school.",
      en: "NEGATIVE\nI'm not · You aren't · He/She/It isn't · We/You/They aren't\n\nExample: She isn't at school.",
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
    grammar: {
      es: "PREGUNTAS\nAm I…? · Are you…? · Is he/she/it…? · Are we/they…?\n\nRespuestas cortas:\nAre you OK? → Yes, I am. / No, I'm not.\nIs he your brother? → Yes, he is. / No, he isn't.",
      en: "QUESTIONS\nAm I…? · Are you…? · Is he/she/it…? · Are we/they…?\n\nShort answers:\nAre you OK? → Yes, I am. / No, I'm not.\nIs he your brother? → Yes, he is. / No, he isn't.",
    },
  },
  {
    slug: "present-simple-affirmative",
    order: 4,
    title: {
      es: "Present simple — afirmativo",
      en: "Present simple — affirmative",
    },
    summary: {
      es: "Hábitos, rutinas y hechos. I play · He plays.",
      en: "Habits, routines and facts. I play · He plays.",
    },
    tip: {
      es: "Palabras clave: always, usually, often, sometimes, never, every day.",
      en: "Signal words: always, usually, often, sometimes, never, every day.",
    },
    grammar: {
      es: "PRESENT SIMPLE — Simple, regular, always!\n\n¿Cuándo?\n· Hábitos / rutinas (I get up at 7 every day)\n· Hechos / leyes (Water boils at 100°C)\n· Verdades generales (The Sun rises in the east)\n· Estados permanentes (I live in Madrid)\n\nAFIRMATIVO\nI/You/We/They + verbo base · He/She/It + verbo +s\n\nPalabras clave: always · usually · often · sometimes · never · every day/week · once a week · in the morning",
      en: "PRESENT SIMPLE — Simple, regular, always!\n\nWhen?\n· Habits / routines (I get up at 7 every day)\n· Facts / laws (Water boils at 100°C)\n· General truths (The Sun rises in the east)\n· Permanent states (I live in Madrid)\n\nAFFIRMATIVE\nI/You/We/They + base verb · He/She/It + verb +s\n\nSignal words: always · usually · often · sometimes · never · every day/week · once a week · in the morning",
    },
  },
  {
    slug: "present-simple-negative",
    order: 5,
    title: { es: "Present simple — negativo", en: "Present simple — negative" },
    summary: {
      es: "I don't play · She doesn't like…",
      en: "I don't play · She doesn't like…",
    },
    tip: {
      es: "Con doesn't el verbo va SIN -s: She doesn't like (no *likes).",
      en: "With doesn't the verb has NO -s: She doesn't like (not *likes).",
    },
    grammar: {
      es: "NEGATIVO\nI/You/We/They + don't + verbo base\nHe/She/It + doesn't + verbo base\n\nEjemplos del cole:\nI don't like spinach · She doesn't watch TV · They don't play tennis on Mondays",
      en: "NEGATIVE\nI/You/We/They + don't + base verb\nHe/She/It + doesn't + base verb\n\nSchool examples:\nI don't like spinach · She doesn't watch TV · They don't play tennis on Mondays",
    },
  },
  {
    slug: "present-simple-spelling",
    order: 6,
    title: {
      es: "Present simple — 3ª persona (-s)",
      en: "Present simple — 3rd person (-s)",
    },
    summary: {
      es: "Solo cambia con he/she/it: plays, watches, studies, has.",
      en: "Only changes with he/she/it: plays, watches, studies, has.",
    },
    tip: {
      es: "have → has en 3ª persona. study → studies (consonante + y).",
      en: "have → has in 3rd person. study → studies (consonant + y).",
    },
    grammar: {
      es: "REGLAS -S (he/she/it)\n· Normal: play → plays · work → works\n· Terminan en -ch, -sh, -x, -o: watch → watches · go → goes\n· Consonante + y: study → studies · try → tries\n· Irregular: have → has\n\nSolo cambia la 3ª persona singular.",
      en: "SPELLING -S (he/she/it)\n· Normal: play → plays · work → works\n· End in -ch, -sh, -x, -o: watch → watches · go → goes\n· Consonant + y: study → studies · try → tries\n· Irregular: have → has\n\nOnly the 3rd person singular changes.",
    },
  },
  {
    slug: "present-simple-questions",
    order: 7,
    title: {
      es: "Present simple — preguntas y respuestas",
      en: "Present simple — questions & answers",
    },
    summary: {
      es: "Do you…? Does she…? Yes, I do / No, she doesn't.",
      en: "Do you…? Does she…? Yes, I do / No, she doesn't.",
    },
    tip: {
      es: "Do you go to school by bus? → Yes, I do. / No, I don't.",
      en: "Do you go to school by bus? → Yes, I do. / No, I don't.",
    },
    grammar: {
      es: "PREGUNTAS\nDo + I/you/we/they + verbo?\nDoes + he/she/it + verbo?\n\nRESPUESTAS CORTAS\nDo you like pizza? → Yes, I do. / No, I don't.\nDoes she play the piano? → Yes, she does. / No, she doesn't.\n\nEjemplo cole: Do you go to school by bus?",
      en: "QUESTIONS\nDo + I/you/we/they + verb?\nDoes + he/she/it + verb?\n\nSHORT ANSWERS\nDo you like pizza? → Yes, I do. / No, I don't.\nDoes she play the piano? → Yes, she does. / No, she doesn't.\n\nSchool example: Do you go to school by bus?",
    },
  },
  {
    slug: "present-simple-wh-questions",
    order: 8,
    title: { es: "Wh- questions", en: "Wh- questions" },
    summary: {
      es: "Who, what, when, where, which, why, how.",
      en: "Who, what, when, where, which, why, how.",
    },
    tip: {
      es: "Wh- + do/does + sujeto + verbo: Where do you go to school?",
      en: "Wh- + do/does + subject + verb: Where do you go to school?",
    },
    grammar: {
      es: "PALABRAS WH\nWho · What · When · Where · Which · Why · How\n\nEjemplos del cole:\nWho's your best friend? → My best friend is Paula.\nWhat are your hobbies? → I like swimming.\nWhere do you meet your friends? → At the park.\nWhy do you do sport? → Because we learn new things.\n\nOrden: Wh- + do/does + sujeto + verbo base",
      en: "WH WORDS\nWho · What · When · Where · Which · Why · How\n\nSchool examples:\nWho's your best friend? → My best friend is Paula.\nWhat are your hobbies? → I like swimming.\nWhere do you meet your friends? → At the park.\nWhy do you do sport? → Because we learn new things.\n\nOrder: Wh- + do/does + subject + base verb",
    },
  },
  {
    slug: "present-continuous",
    order: 9,
    title: { es: "Present continuous", en: "Present continuous" },
    summary: {
      es: "Acciones ahora: am/is/are + verbo-ing.",
      en: "Actions now: am/is/are + verb-ing.",
    },
    tip: {
      es: "Palabras clave: now, right now, at the moment, currently.",
      en: "Signal words: now, right now, at the moment, currently.",
    },
    grammar: {
      es: "PRESENT CONTINUOUS\n\n¿Cuándo?\n· Ahora mismo (I am playing now)\n· Situación temporal (We are living in Madrid)\n· Algo que está pasando these days\n\nFORMA: am / is / are + verbo-ing\nNegativo: I am not playing · He isn't reading\nPreguntas: Are you playing? · Is she reading?\n\nSPELLING -ing:\nplay→playing · write→writing · run→running\n\nPalabras: now · right now · at the moment · today · currently",
      en: "PRESENT CONTINUOUS\n\nWhen?\n· Right now (I am playing now)\n· Temporary (We are living in Madrid)\n· Happening these days\n\nFORM: am / is / are + verb-ing\nNegative: I am not playing · He isn't reading\nQuestions: Are you playing? · Is she reading?\n\nSPELLING -ing:\nplay→playing · write→writing · run→running\n\nSignal words: now · right now · at the moment · today · currently",
    },
  },
  {
    slug: "daily-routine-tom",
    order: 10,
    title: { es: "Lectura: Tom's day", en: "Reading: Tom's day" },
    summary: {
      es: "Texto del workbook del cole — rutina en present simple.",
      en: "School workbook text — daily routine in present simple.",
    },
    tip: {
      es: "Tom lives in Manchester. Subrayá los verbos en present simple.",
      en: "Tom lives in Manchester. Underline the present simple verbs.",
    },
    grammar: {
      es: "READING — TOM'S DAY\n\nTom is ten years old. He lives in Manchester, England. He goes to school from Monday to Friday. He gets up at 7:00 and has breakfast at 7:30. He goes to school at 8:15. He has lunch at school. After school he plays football with his friends. He likes comics and video games. He doesn't like vegetables but he eats fruit. He has dinner at 7:00 and goes to bed at 9:30.\n\nTrue or false del cole:\n· Tom is ten · He lives in Manchester · He plays football after school",
      en: "READING — TOM'S DAY\n\nTom is ten years old. He lives in Manchester, England. He goes to school from Monday to Friday. He gets up at 7:00 and has breakfast at 7:30. He goes to school at 8:15. He has lunch at school. After school he plays football with his friends. He likes comics and video games. He doesn't like vegetables but he eats fruit. He has dinner at 7:00 and goes to bed at 9:30.\n\nSchool true or false:\n· Tom is ten · He lives in Manchester · He plays football after school",
    },
  },
  {
    slug: "review-mix",
    order: 11,
    title: { es: "Repaso ficha del cole", en: "School sheet review" },
    summary: {
      es: "Mezcla: to be + present simple + continuous (fichas del cole).",
      en: "Mix: to be + present simple + continuous (school sheets).",
    },
    tip: {
      es: "Leé la frase entera: ¿to be o present simple? ¿afirmativo, negativo o pregunta?",
      en: "Read the full sentence: to be or present simple? affirmative, negative or question?",
    },
    grammar: {
      es: "RESUMEN FICHA\n· To be: am/is/are + preguntas y respuestas cortas\n· Present simple: rutinas y hechos\n· 3ª persona: +s / +es / +ies · have→has\n· Negativo: don't / doesn't\n· Preguntas: Do/Does · Wh- questions",
      en: "SHEET SUMMARY\n· To be: am/is/are + questions and short answers\n· Present simple: routines and facts\n· 3rd person: +s / +es / +ies · have→has\n· Negative: don't / doesn't\n· Questions: Do/Does · Wh- questions",
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
