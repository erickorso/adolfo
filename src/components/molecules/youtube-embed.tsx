"use client";

import { useMemo, useSyncExternalStore } from "react";

type YoutubeEmbedProps = {
  videoId: string;
  title: string;
  onLoad?: () => void;
};

function subscribeToOrigin() {
  return () => {};
}

function getClientOrigin() {
  return window.location.origin;
}

function getServerOrigin() {
  return null;
}

export function YoutubeEmbed({ videoId, title, onLoad }: YoutubeEmbedProps) {
  const origin = useSyncExternalStore(
    subscribeToOrigin,
    getClientOrigin,
    getServerOrigin,
  );

  const embedSrc = useMemo(() => {
    if (!origin) {
      return null;
    }

    const params = new URLSearchParams({ rel: "0", origin });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [origin, videoId]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
      {embedSrc ? (
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
      ) : (
        <p
          className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted-foreground"
          role="status"
        >
          {title}
        </p>
      )}
    </div>
  );
}
