/** Formatea una fecha a un string corto legible (es-AR). */
export function formatDate(
  date: Date | null,
  locale = "es-AR",
): string {
  if (!date) {
    return "—";
  }
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
