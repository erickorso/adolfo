import { lookupVocabulary, getSortedVocabKeys } from "./vocabulary";

export type DictionaryToken =
  | { type: "text"; value: string }
  | { type: "word"; value: string; display: string };

const WORD_CHAR = /[A-Za-z']/;

function isBoundary(text: string, index: number): boolean {
  if (index <= 0 || index >= text.length) {
    return true;
  }
  return !WORD_CHAR.test(text[index]!);
}

/** Tokeniza texto marcando palabras/frases del diccionario A1. */
export function tokenizeForDictionary(text: string): DictionaryToken[] {
  return tokenizeWithKeys(text, getSortedVocabKeys());
}

export function tokenizeWithKeys(
  text: string,
  sortedKeys: string[],
): DictionaryToken[] {
  const tokens: DictionaryToken[] = [];
  let i = 0;

  while (i < text.length) {
    const ch = text[i]!;

    if (!WORD_CHAR.test(ch)) {
      let j = i + 1;
      while (j < text.length && !WORD_CHAR.test(text[j]!)) {
        j++;
      }
      tokens.push({ type: "text", value: text.slice(i, j) });
      i = j;
      continue;
    }

    let matched: { key: string; display: string } | null = null;

    for (const key of sortedKeys) {
      const slice = text.slice(i, i + key.length);
      if (slice.toLowerCase() !== key.toLowerCase()) {
        continue;
      }
      if (!isBoundary(text, i) || !isBoundary(text, i + key.length)) {
        continue;
      }
      matched = { key, display: slice };
      break;
    }

    if (matched) {
      tokens.push({ type: "word", value: matched.key, display: matched.display });
      i += matched.key.length;
      continue;
    }

    let j = i + 1;
    while (j < text.length && WORD_CHAR.test(text[j]!)) {
      j++;
    }
    const word = text.slice(i, j);
    const entry = lookupVocabulary(word);
    if (entry) {
      tokens.push({ type: "word", value: entry.key, display: word });
    } else {
      tokens.push({ type: "text", value: word });
    }
    i = j;
  }

  return tokens;
}
