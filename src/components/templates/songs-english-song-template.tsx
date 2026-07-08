import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ExternalLink, FileText } from "lucide-react";
import { YoutubeEmbed } from "@/components/molecules/youtube-embed";
import { getSongBySlug } from "@/domain/learning/songs-english/songs";
import { songLocalizedText } from "@/domain/learning/songs-english/song.types";
import { notFound } from "next/navigation";

type SongsEnglishSongTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function SongsEnglishSongTemplate({
  params,
}: SongsEnglishSongTemplateProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  if (!song) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("songsEnglish"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link
          href="/learn/songs-english"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToModule")}
        </Link>
      </nav>

      <section className="rounded-lg border border-border bg-card p-6">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground">{t("artist")}</dt>
            <dd>{song.artist}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">{t("source")}</dt>
            <dd>{songLocalizedText(locale, song.source)}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">{t("year")}</dt>
            <dd>{song.year}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-muted-foreground">
          {songLocalizedText(locale, song.summary)}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={song.pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            <FileText className="size-4" aria-hidden />
            {t("openPdf")}
          </a>
          {song.youtubeId ? (
            <a
              href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <ExternalLink className="size-4" aria-hidden />
              {t("listenYoutube")}
            </a>
          ) : null}
          {song.links?.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              <ExternalLink className="size-4" aria-hidden />
              {songLocalizedText(locale, link.label)}
            </a>
          ))}
        </div>
      </section>

      {song.youtubeId ? (
        <section aria-labelledby="video-heading">
          <h2 id="video-heading" className="mb-4 text-lg font-semibold">
            {t("videoEmbedTitle")}
          </h2>
          <YoutubeEmbed
            videoId={song.youtubeId}
            title={`${song.title} — ${song.artist}`}
          />
        </section>
      ) : null}

      <section aria-labelledby="lyrics-heading">
        <h2 id="lyrics-heading" className="mb-4 text-lg font-semibold">
          {t("lyricsTitle")}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  English
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold">
                  Español
                </th>
              </tr>
            </thead>
            <tbody>
              {song.lyrics.map((line, index) => (
                <tr
                  key={`${line.en}-${index}`}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-2.5 font-medium">{line.en}</td>
                  <td className="px-4 py-2.5 text-muted-foreground italic">
                    {line.es}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="mb-4 text-lg font-semibold">
          {t("notesTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {song.notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/40"
            >
              <p className="font-semibold text-violet-900 dark:text-violet-200">
                {note.term}
              </p>
              {note.lineEn ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("noteLineRef")}: &ldquo;{note.lineEn}&rdquo;
                </p>
              ) : null}
              <p className="mt-2 text-sm text-muted-foreground">
                {songLocalizedText(locale, note.explanation)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
