import { getTranslations } from "next-intl/server";
import { LearnModuleShell } from "@/components/templates/learn-module-shell";
import { SongsEnglishSongTemplate } from "@/components/templates/songs-english-song-template";
import { ENGLISH_SONGS, getSongBySlug } from "@/domain/learning/songs-english/songs";

type SongsEnglishSongPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ENGLISH_SONGS.map((song) => ({ slug: song.slug }));
}

export default async function SongsEnglishSongPage({
  params,
}: SongsEnglishSongPageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  const t = await getTranslations("songsEnglish");

  return (
    <LearnModuleShell
      title={song?.title ?? t("title")}
      subtitle={song?.artist}
      badge={t("badge")}
    >
      <SongsEnglishSongTemplate params={params} />
    </LearnModuleShell>
  );
}
