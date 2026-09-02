"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useEnglishA1Vocab } from "@/components/organisms/english-a1-vocab-provider";
import { ENGLISH_A1_VOCAB_LIST } from "@/domain/learning/english-a1/vocabulary";
import { cn } from "@/lib/utils";

export function EnglishA1DictionarySidebar() {
  const t = useTranslations("englishA1");
  const { openWord } = useEnglishA1Vocab();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return ENGLISH_A1_VOCAB_LIST.slice(0, 24);
    }
    return ENGLISH_A1_VOCAB_LIST.filter(
      (entry) =>
        entry.key.includes(q) ||
        entry.en.toLowerCase().includes(q) ||
        entry.es.toLowerCase().includes(q),
    ).slice(0, 40);
  }, [query]);

  return (
    <aside
      className="rounded-lg border border-border bg-card p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
      aria-labelledby="english-a1-dictionary-sidebar-heading"
    >
      <h2
        id="english-a1-dictionary-sidebar-heading"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {t("dictionaryTitle")}
      </h2>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("dictionarySearch")}
        className="mb-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        aria-label={t("dictionarySearch")}
      />

      <ul className="flex flex-col gap-1.5">
        {filtered.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              onClick={() => openWord(entry.key)}
              className={cn(
                "flex w-full flex-col rounded-md border border-transparent px-2 py-1.5 text-left text-sm",
                "hover:border-primary/30 hover:bg-primary/5",
              )}
            >
              <span className="font-medium text-primary">{entry.en}</span>
              <span className="text-xs text-muted-foreground">{entry.es}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs text-muted-foreground">
        {t("dictionaryCount", { count: filtered.length })}
      </p>
    </aside>
  );
}
