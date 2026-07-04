"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useElementScrollProgress } from "@/hooks/use-element-scroll-progress";
import { cn } from "@/lib/utils";

type SlidePanel = {
  title: string;
  body: string;
};

export function MotionLabHorizontalSlideDemo() {
  const t = useTranslations("motionLab");
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(scrollRef);
  const panels = t.raw("slideX.panels") as SlidePanel[];

  useEffect(() => {
    const scrollNode = scrollRef.current;
    const trackNode = trackRef.current;
    if (!scrollNode || !trackNode) {
      return;
    }
    const distance = Math.max(0, trackNode.scrollWidth - scrollNode.clientWidth);
    trackNode.style.setProperty("--motion-slide-x", `${-progress * distance}px`);
  }, [progress]);

  return (
    <div
      ref={scrollRef}
      className="motion-lab__horizontal-scroll-zone"
      aria-label={t("slideX.demoLabel")}
    >
      <div className="motion-lab__horizontal-sticky">
        <div className="motion-lab__horizontal-meta">
          <span className="motion-lab__horizontal-hint">{t("slideX.scrollHint")}</span>
          <progress
            className="motion-lab__horizontal-progress"
            value={Math.round(progress * 100)}
            max={100}
            aria-label={t("slideX.progressLabel")}
          />
        </div>

        <div className="motion-lab__horizontal-viewport">
          <div ref={trackRef} className="motion-lab__horizontal-track">
            {panels.map((panel, index) => (
              <article
                key={panel.title}
                className={cn(
                  "motion-lab__horizontal-panel",
                  progress * (panels.length - 1) >= index - 0.35 &&
                    "motion-lab__horizontal-panel--active",
                )}
              >
                <span className="motion-lab__horizontal-panel-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="motion-lab__horizontal-panel-title">{panel.title}</h3>
                <p className="motion-lab__horizontal-panel-body">{panel.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
