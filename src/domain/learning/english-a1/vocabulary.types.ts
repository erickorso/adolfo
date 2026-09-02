export type VocabCategory =
  | "greetings"
  | "grammar"
  | "family"
  | "school"
  | "food"
  | "sport"
  | "animals"
  | "colors"
  | "time"
  | "verbs"
  | "other";

export type VocabEntry = {
  key: string;
  en: string;
  es: string;
  category: VocabCategory;
  example?: string;
};
