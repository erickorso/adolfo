import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileText, Music } from "lucide-react";
import { ENGLISH_SONGS } from "@/domain/learning/songs-english/songs";
import { songLocalizedText } from "@/domain/learning/songs-english/song.types";

export async function SongsEnglishCourseTemplate() {
  const [t, locale] = await Promise.all([
    getTranslations("songsEnglish"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("aboutTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("aboutBody")}</p>
      </section>

      <section aria-labelledby="songs-list-heading">
        <h2 id="songs-list-heading" className="mb-4 text-lg font-semibold">
          {t("songListTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {ENGLISH_SONGS.map((song) => (
            <li key={song.slug}>
              <Link
                href={`/learn/songs-english/${song.slug}`}
                className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-md bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
                  aria-hidden
                >
                  <Music className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-semibold">{song.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {song.artist} · {song.year}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {songLocalizedText(locale, song.summary)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                  <FileText className="size-3.5" aria-hidden />
                  PDF
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
