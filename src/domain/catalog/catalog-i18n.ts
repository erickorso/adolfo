/**
 * Texto de catálogo: `name`/`description` = ES (canónico).
 * `nameEn`/`descriptionEn` opcionales; si faltan, fallback a ES.
 */
export function catalogLocalizedText(
  locale: string,
  es: string | null | undefined,
  en: string | null | undefined,
): string | null {
  if (locale === "en" && en?.trim()) {
    return en;
  }
  return es ?? null;
}

export function catalogLocalizedName(
  locale: string,
  nameEs: string,
  nameEn: string | null | undefined,
): string {
  return catalogLocalizedText(locale, nameEs, nameEn) ?? nameEs;
}
