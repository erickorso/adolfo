"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import type { VocabEntry } from "@/domain/learning/english-a1/vocabulary.types";
import { lookupVocabulary } from "@/domain/learning/english-a1/vocabulary";
import { cn } from "@/lib/utils";

type EnglishA1VocabContextValue = {
  openWord: (raw: string) => void;
};

const EnglishA1VocabContext = createContext<EnglishA1VocabContextValue | null>(
  null,
);

export function useEnglishA1Vocab(): EnglishA1VocabContextValue {
  const ctx = useContext(EnglishA1VocabContext);
  if (!ctx) {
    throw new Error("useEnglishA1Vocab must be used within EnglishA1VocabProvider");
  }
  return ctx;
}

type EnglishA1VocabProviderProps = {
  children: ReactNode;
};

export function EnglishA1VocabProvider({ children }: EnglishA1VocabProviderProps) {
  const t = useTranslations("englishA1");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [entry, setEntry] = useState<VocabEntry | null>(null);

  const openWord = useCallback((raw: string) => {
    const found = lookupVocabulary(raw);
    if (!found) {
      return;
    }
    setEntry(found);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setEntry(null);
  }, []);

  const value = useMemo(() => ({ openWord }), [openWord]);

  return (
    <EnglishA1VocabContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className={cn(
          "english-a1-vocab-modal w-[min(100%,24rem)] rounded-lg border border-border bg-card p-0 shadow-lg",
          "backdrop:bg-black/50",
        )}
        onClose={close}
        aria-labelledby="english-a1-vocab-title"
      >
        {entry ? (
          <div className="flex flex-col gap-3 p-5">
            <header className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("dictionaryWordLabel")}
                </p>
                <h2
                  id="english-a1-vocab-title"
                  className="text-xl font-bold text-primary"
                >
                  {entry.en}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
                aria-label={t("dictionaryClose")}
              >
                ✕
              </button>
            </header>
            <p className="text-lg font-medium">{entry.es}</p>
            {entry.example ? (
              <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                {entry.example}
              </p>
            ) : null}
            <p className="text-xs text-muted-foreground">
              {t("dictionaryCategory", { category: entry.category })}
            </p>
          </div>
        ) : null}
      </dialog>
    </EnglishA1VocabContext.Provider>
  );
}
