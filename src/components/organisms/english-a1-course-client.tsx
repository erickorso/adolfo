"use client";

import { EnglishA1DictionaryBrowser } from "@/components/organisms/english-a1-dictionary-browser";
import { EnglishA1VocabProvider } from "@/components/organisms/english-a1-vocab-provider";

export function EnglishA1CourseClient() {
  return (
    <EnglishA1VocabProvider>
      <EnglishA1DictionaryBrowser />
    </EnglishA1VocabProvider>
  );
}
