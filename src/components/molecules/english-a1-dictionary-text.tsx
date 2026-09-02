"use client";

import { tokenizeForDictionary } from "@/domain/learning/english-a1/tokenize-vocabulary";
import { useEnglishA1Vocab } from "@/components/organisms/english-a1-vocab-provider";
import { cn } from "@/lib/utils";

type EnglishA1DictionaryTextProps = {
  text: string;
  className?: string;
};

export function EnglishA1DictionaryText({
  text,
  className,
}: EnglishA1DictionaryTextProps) {
  const { openWord } = useEnglishA1Vocab();
  const tokens = tokenizeForDictionary(text);

  return (
    <span className={className}>
      {tokens.map((token, index) => {
        if (token.type === "text") {
          return <span key={`${index}-${token.value}`}>{token.value}</span>;
        }
        return (
          <button
            key={`${index}-${token.value}`}
            type="button"
            onClick={() => openWord(token.value)}
            className={cn(
              "english-a1-dictionary-text__word rounded-sm px-0.5 font-medium text-primary underline decoration-dotted underline-offset-2",
              "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
            aria-label={token.display}
          >
            {token.display}
          </button>
        );
      })}
    </span>
  );
}
