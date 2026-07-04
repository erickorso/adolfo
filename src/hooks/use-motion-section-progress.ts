"use client";

import { useLayoutEffect, useState } from "react";
import { motionCatalogSectionProgress } from "@/domain/learning/motion/motion-catalog-bg";

function readSectionProgress(sectionId: string): number {
  const section = document.getElementById(`motion-${sectionId}`);
  if (!section) {
    return 0;
  }
  return motionCatalogSectionProgress(section);
}

/** Progreso 0→1 del scroll dentro de un capítulo Motion UI. */
export function useMotionSectionProgress(sectionId: string): number {
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      setProgress(readSectionProgress(sectionId));
    };

    update();
    const rafId = requestAnimationFrame(update);
    const restoreId = window.setTimeout(update, 0);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("pageshow", update);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(restoreId);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("pageshow", update);
    };
  }, [sectionId]);

  return progress;
}

export function mapSectionProgressToReveal(
  progress: number,
  start = 0.12,
  end = 0.88,
): number {
  if (progress <= start) {
    return 0;
  }
  if (progress >= end) {
    return 1;
  }
  return (progress - start) / (end - start);
}
