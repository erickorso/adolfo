"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { MOTION_PRINCIPLES } from "@/domain/learning/motion/motion-principles";
import { cn } from "@/lib/utils";

type MotionLabChapterNavProps = {
  activeId: string;
};

export function MotionLabChapterNav({ activeId }: MotionLabChapterNavProps) {
  const t = useTranslations("motionLab");

  useEffect(() => {
    const sections = MOTION_PRINCIPLES.flatMap(({ id }) => {
      const section = document.getElementById(`motion-${id}`);
      return section ? [section] : [];
    });

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          const link = document.querySelector<HTMLAnchorElement>(
            `[data-motion-chapter="${visible.target.id}"]`,
          );
          document
            .querySelectorAll("[data-motion-chapter]")
            .forEach((node) => node.classList.remove("motion-lab__chapter-link--active"));
          link?.classList.add("motion-lab__chapter-link--active");
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="motion-lab__chapter-nav" aria-label={t("chapterNav")}>
      {MOTION_PRINCIPLES.map(({ id, number }) => (
        <a
          key={id}
          href={`#motion-${id}`}
          data-motion-chapter={`motion-${id}`}
          className={cn(
            "motion-lab__chapter-link",
            activeId === id && "motion-lab__chapter-link--active",
          )}
        >
          {number}. {t(`principles.${id}.shortTitle`)}
        </a>
      ))}
    </nav>
  );
}
