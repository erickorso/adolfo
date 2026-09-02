"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EnglishA1DictionarySidebar } from "@/components/organisms/english-a1-dictionary-sidebar";
import { cn } from "@/lib/utils";

const DRAWER_WIDTH = "18rem";

type EnglishA1CollapsibleDictionaryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EnglishA1CollapsibleDictionary({
  open,
  onOpenChange,
}: EnglishA1CollapsibleDictionaryProps) {
  const t = useTranslations("englishA1");

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      onOpenChange(true);
    }
    // Solo al montar: abrir en desktop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <aside
        id="english-a1-dictionary-drawer"
        className={cn(
          "english-a1-dictionary-drawer fixed top-0 left-0 z-40 flex h-full flex-col border-r border-border bg-card shadow-lg transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: DRAWER_WIDTH }}
        aria-hidden={!open}
      >
        <div className="flex-1 overflow-y-auto p-4 pt-16 lg:pt-6">
          <EnglishA1DictionarySidebar embedded />
        </div>
      </aside>

      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "english-a1-dictionary-drawer__toggle fixed top-1/2 z-50 flex size-9 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-border bg-card text-muted-foreground shadow-sm transition-[left] duration-300 ease-in-out hover:bg-muted hover:text-foreground",
          open ? "left-[18rem]" : "left-0",
        )}
        aria-expanded={open}
        aria-controls="english-a1-dictionary-drawer"
        aria-label={open ? t("dictionaryPanelClose") : t("dictionaryOpen")}
      >
        {open ? (
          <ChevronLeft className="size-5" aria-hidden />
        ) : (
          <ChevronRight className="size-5" aria-hidden />
        )}
      </button>

      {open ? (
        <button
          type="button"
          className="english-a1-dictionary-drawer__backdrop fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => onOpenChange(false)}
          aria-label={t("dictionaryPanelClose")}
        />
      ) : null}
    </>
  );
}
