"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CATALOG_PLACEHOLDER_IMAGES } from "@/lib/catalog-placeholders";
import {
  mapSectionProgressToReveal,
  useMotionSectionProgress,
} from "@/hooks/use-motion-section-progress";

const MASK_DEMO_IMAGE = CATALOG_PLACEHOLDER_IMAGES["buzo-canguro"];

export function MotionLabMaskDemo() {
  const t = useTranslations("motionLab");
  const frameRef = useRef<HTMLDivElement>(null);
  const sectionProgress = useMotionSectionProgress("masking");
  const reveal = mapSectionProgressToReveal(sectionProgress);

  useEffect(() => {
    frameRef.current?.style.setProperty("--motion-mask-reveal", String(reveal));
  }, [reveal]);

  return (
    <div
      ref={frameRef}
      className="motion-lab__demo motion-lab__mask-frame"
      aria-label={t("masking.demoLabel")}
    >
      <Image
        src={MASK_DEMO_IMAGE}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className="motion-lab__mask-photo"
      />
      <div className="motion-lab__mask-fill" aria-hidden="true" />
      <p className="motion-lab__mask-label">{t("masking.demoText")}</p>
      <p className="motion-lab__mask-hint">{t("masking.demoHint")}</p>
    </div>
  );
}
