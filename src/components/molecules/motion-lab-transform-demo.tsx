"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import {
  mapSectionProgressToReveal,
  useMotionSectionProgress,
} from "@/hooks/use-motion-section-progress";
import { cn } from "@/lib/utils";

function morphMetrics(reveal: number) {
  return {
    widthRem: 5 + reveal * 15,
    heightRem: 5 + reveal * 3,
    radiusPx: Math.max(16, 9999 - reveal * 9983),
  };
}

export function MotionLabTransformDemo() {
  const t = useTranslations("motionLab");
  const boxRef = useRef<HTMLButtonElement>(null);
  const sectionProgress = useMotionSectionProgress("transform");
  const scrollReveal = mapSectionProgressToReveal(sectionProgress);
  const [expanded, setExpanded] = useState(false);
  const [smooth, setSmooth] = useState(false);
  const reveal = expanded ? 1 : scrollReveal;
  const { widthRem, heightRem, radiusPx } = morphMetrics(reveal);

  useLayoutEffect(() => {
    boxRef.current?.style.setProperty("--motion-morph-progress", String(reveal));
  }, [reveal]);

  const boxStyle: CSSProperties = {
    width: `min(${widthRem}rem, calc(100% - 2rem))`,
    height: `${heightRem}rem`,
    borderRadius: `${radiusPx}px`,
    ["--motion-morph-progress" as string]: reveal,
  };

  const toggleMorph = () => {
    setSmooth(true);
    setExpanded((value) => !value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleMorph();
    }
  };

  return (
    <div
      className={cn(
        "motion-lab__demo motion-lab__morph-stage",
        smooth && "motion-lab__morph-stage--smooth",
      )}
      aria-label={t("transform.demoLabel")}
    >
      <button
        ref={boxRef}
        type="button"
        className="motion-lab__morph-box"
        style={boxStyle}
        aria-pressed={reveal > 0.5}
        aria-label={t("transform.demoToggleLabel")}
        onClick={toggleMorph}
        onKeyDown={handleKeyDown}
      >
        <span className="motion-lab__morph-label motion-lab__morph-label--compact">
          {t("transform.demoCompact")}
        </span>
        <span className="motion-lab__morph-label motion-lab__morph-label--expanded">
          {t("transform.demoExpanded")}
        </span>
      </button>
      <p className="motion-lab__morph-hint">{t("transform.demoHint")}</p>
    </div>
  );
}
