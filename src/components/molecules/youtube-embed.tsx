"use client";

type YoutubeEmbedProps = {
  videoId: string;
  title: string;
  onLoad?: () => void;
};

/**
 * Embed YouTube. `referrerPolicy` estricto: YouTube exige Referer (Error 153
 * si el sitio usa `same-origin` / `no-referrer`).
 */
export function YoutubeEmbed({ videoId, title, onLoad }: YoutubeEmbedProps) {
  const embedSrc = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
      <iframe
        title={title}
        src={embedSrc}
        className="absolute inset-0 size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={onLoad}
      />
    </div>
  );
}
