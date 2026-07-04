"use client";

import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { MotionLabChapterNav } from "@/components/molecules/motion-lab-chapter-nav";
import { MotionLabPrincipleSection } from "@/components/organisms/motion-lab-principle-section";
import { MOTION_PRINCIPLES } from "@/domain/learning/motion/motion-principles";

export function MotionLabPageClient() {
  const t = useTranslations("motionLab");

  return (
    <div className="motion-lab mx-auto max-w-6xl px-4">
      <section className="motion-lab__hero" aria-labelledby="motion-lab-hero-title">
        <span className="motion-lab__hero-badge">{t("badge")}</span>
        <h1 id="motion-lab-hero-title" className="motion-lab__hero-title">
          {t("title")}
        </h1>
        <p className="motion-lab__hero-subtitle">{t("subtitle")}</p>
        <p className="max-w-2xl text-sm text-muted-foreground">{t("intro")}</p>
        <a href="#motion-easing" className="motion-lab__scroll-hint">
          <ArrowDown className="motion-lab__scroll-hint-icon size-4" aria-hidden />
          {t("scrollHint")}
        </a>
      </section>

      <div className="motion-lab__layout">
        <div className="motion-lab__sections">
          {MOTION_PRINCIPLES.map((principle) => (
            <MotionLabPrincipleSection
              key={principle.id}
              id={principle.id}
              number={principle.number}
            />
          ))}

          <footer className="motion-lab__credit">
            {t("creditPrefix")}{" "}
            <a
              href="https://motion.zajno.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              motion.zajno.com
            </a>
            {t("creditSuffix")}
          </footer>
        </div>

        <MotionLabChapterNav activeId="easing" />
      </div>
    </div>
  );
}
