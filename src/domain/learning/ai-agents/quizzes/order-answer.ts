const ORDER_SEPARATOR = "|";

export function serializeOrder(ids: string[]): string {
  return ids.join(ORDER_SEPARATOR);
}

export function parseOrder(value: string): string[] {
  return value.split(ORDER_SEPARATOR).filter(Boolean);
}

export function isOrderCorrect(answer: string, correctOrder: string[]): boolean {
  return answer === serializeOrder(correctOrder);
}

/** Shuffle determinístico para hidratación estable por pregunta. */
export function shuffleIds(ids: string[], seed: string): string[] {
  const result = [...ids];
  let state = 0;

  for (let i = 0; i < seed.length; i += 1) {
    state = (state * 31 + seed.charCodeAt(i)) >>> 0;
  }

  for (let i = result.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}

export function isSameOrder(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}
