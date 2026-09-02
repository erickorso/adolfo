"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useEnglishA1Vocab } from "@/components/organisms/english-a1-vocab-provider";
import type { VocabCategory } from "@/domain/learning/english-a1/vocabulary.types";
import { ENGLISH_A1_VOCAB_LIST } from "@/domain/learning/english-a1/vocabulary";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<VocabCategory | "all"> = [
  "all",
  "greetings",
  "grammar",
  "verbs",
  "school",
  "family",
  "food",
  "sport",
  "animals",
  "colors",
  "time",
  "other",
];

export function EnglishA1DictionaryBrowser() {
  const t = useTranslations("englishA1");
  const { openWord } = useEnglishA1Vocab();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VocabCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENGLISH_A1_VOCAB_LIST.filter((entry) => {
      if (category !== "all" && entry.category !== category) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        entry.key.includes(q) ||
        entry.en.toLowerCase().includes(q) ||
        entry.es.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <section
      className="rounded-lg border border-border bg-card p-5"
      aria-labelledby="english-a1-dictionary-heading"
    >
      <h2
        id="english-a1-dictionary-heading"
        className="mb-1 text-lg font-semibold"
      >
        {t("dictionaryTitle")}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        {t("dictionaryHint")}
      </p>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("dictionarySearch")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label={t("dictionarySearch")}
        />
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as VocabCategory | "all")
          }
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label={t("dictionaryFilter")}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`dictionaryCat_${cat}`)}
            </option>
          ))}
        </select>
      </div>

      <ul className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
        {filtered.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              onClick={() => openWord(entry.key)}
              className={cn(
                "flex w-full flex-col rounded-md border border-border px-3 py-2 text-left text-sm",
                "hover:border-primary hover:bg-primary/5",
              )}
            >
              <span className="font-semibold text-primary">{entry.en}</span>
              <span className="text-muted-foreground">{entry.es}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        {t("dictionaryCount", { count: filtered.length })}
      </p>
    </section>
  );
}
