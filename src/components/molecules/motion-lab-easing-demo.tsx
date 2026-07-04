"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import type { EasingPresetId } from "@/domain/learning/motion/motion-principles";
import { EASING_PRESETS } from "@/domain/learning/motion/motion-principles";
import { cn } from "@/lib/utils";

export function MotionLabEasingDemo() {
  const t = useTranslations("motionLab");
  const [preset, setPreset] = useState<EasingPresetId>("ease");
  const [runKey, setRunKey] = useState(0);
  const [running, setRunning] = useState(true);

  const replay = useCallback(() => {
    setRunning(false);
    setRunKey((value) => value + 1);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRunning(true));
    });
  }, []);

  return (
    <div className="motion-lab__demo" aria-label={t("easing.demoLabel")}>
      <div className="motion-lab__easing-tabs" role="tablist" aria-label={t("easing.tabsLabel")}>
        {EASING_PRESETS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={preset === id}
            className={cn(
              "motion-lab__easing-tab",
              preset === id && "motion-lab__easing-tab--active",
            )}
            onClick={() => {
              setPreset(id);
              replay();
            }}
          >
            {t(`easing.presets.${id}`)}
          </button>
        ))}
      </div>
      <div className="motion-lab__demo-track" key={runKey}>
        <div
          className={cn(
            "motion-lab__demo-ball",
            `motion-lab__demo-ball--${preset}`,
            running && "motion-lab__demo-ball--run",
          )}
          aria-hidden="true"
        />
      </div>
      <button
        type="button"
        className="motion-lab__easing-tab motion-lab__easing-tab--active w-fit"
        onClick={replay}
      >
        {t("easing.replay")}
      </button>
    </div>
  );
}
