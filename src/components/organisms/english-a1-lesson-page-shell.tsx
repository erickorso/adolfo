"use client";

import { useState, type ReactNode } from "react";
import { EnglishA1CollapsibleDictionary } from "@/components/organisms/english-a1-collapsible-dictionary";
import { EnglishA1VocabProvider } from "@/components/organisms/english-a1-vocab-provider";
import { cn } from "@/lib/utils";

type EnglishA1LessonPageShellProps = {
  children: ReactNode;
};

export function EnglishA1LessonPageShell({
  children,
}: EnglishA1LessonPageShellProps) {
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  return (
    <EnglishA1VocabProvider>
      <EnglishA1CollapsibleDictionary
        open={dictionaryOpen}
        onOpenChange={setDictionaryOpen}
      />
      <div
        className={cn(
          "transition-[padding] duration-300 ease-in-out",
          dictionaryOpen && "lg:pl-72",
        )}
      >
        {children}
      </div>
    </EnglishA1VocabProvider>
  );
}
