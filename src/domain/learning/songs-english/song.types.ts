export type LocalizedText = { es: string; en: string };

export type SongLyricLine = {
  en: string;
  es: string;
};

export type SongNote = {
  id: string;
  term: string;
  explanation: LocalizedText;
  /** Línea EN a la que aplica (opcional). */
  lineEn?: string;
};

export type EnglishSong = {
  slug: string;
  order: number;
  title: string;
  artist: string;
  source: LocalizedText;
  year: number;
  pdfPath: string;
  youtubeId?: string;
  summary: LocalizedText;
  lyrics: SongLyricLine[];
  notes: SongNote[];
};

export function songLocalizedText(
  locale: string,
  text: LocalizedText,
): string {
  return locale === "en" ? text.en : text.es;
}
