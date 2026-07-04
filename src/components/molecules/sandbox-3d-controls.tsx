"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Sandbox3dCanvas } from "@/components/organisms/sandbox-3d-canvas";
import {
  DEFAULT_SANDBOX_3D_STATE,
  SANDBOX_DEMO_IDS,
  TOUR_VIEWPOINTS,
  type SandboxDemoId,
  type SandboxShape,
  type TourViewpointId,
} from "@/domain/sandbox3d/sandbox3d.types";

const SHAPES: SandboxShape[] = ["box", "sphere", "torus", "icosahedron"];

type Sandbox3dControlsProps = {
  demo: SandboxDemoId;
  onDemoChange: (demo: SandboxDemoId) => void;
};

export function Sandbox3dControls({ demo, onDemoChange }: Sandbox3dControlsProps) {
  const t = useTranslations("sandbox3d");
  const formId = useId();
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SANDBOX_3D_STATE;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return reducedMotion
      ? { ...DEFAULT_SANDBOX_3D_STATE, autoRotate: false }
      : DEFAULT_SANDBOX_3D_STATE;
  });
  const [tourView, setTourView] = useState<TourViewpointId>("living");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      if (media.matches) {
        setState((current) => ({ ...current, autoRotate: false }));
      }
    };
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  const canvasLabel =
    demo === "room"
      ? t("canvasLabelRoom")
      : demo === "tour"
        ? t("canvasLabelTour")
        : t("canvasLabel");

  return (
    <section
      aria-labelledby={`${formId}-title`}
      className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5"
    >
      <div>
        <h2 className="text-lg font-semibold" id={`${formId}-title`}>
          {t("controlsTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("controlsHint")}</p>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">{t("demo")}</legend>
        <div className="flex flex-wrap gap-2">
          {SANDBOX_DEMO_IDS.map((demoId) => (
            <button
              key={demoId}
              aria-pressed={demo === demoId}
              className={cn(
                "rounded-md border border-border px-3 py-1.5 text-sm",
                demo === demoId &&
                  "border-primary bg-primary text-primary-foreground",
              )}
              onClick={() => onDemoChange(demoId)}
              type="button"
            >
              {t(`demos.${demoId}.label`)}
            </button>
          ))}
        </div>
      </fieldset>

      {demo === "tour" ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">{t("tourStops")}</legend>
          <div className="flex flex-wrap gap-2">
            {TOUR_VIEWPOINTS.map((viewpoint) => (
              <button
                key={viewpoint.id}
                aria-pressed={tourView === viewpoint.id}
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 text-sm",
                  tourView === viewpoint.id &&
                    "border-primary bg-primary text-primary-foreground",
                )}
                onClick={() => setTourView(viewpoint.id)}
                type="button"
              >
                {t(`tour.${viewpoint.id}`)}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {demo === "playground" ? (
        <>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium">{t("shape")}</legend>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((shape) => (
                <button
                  key={shape}
                  aria-pressed={state.shape === shape}
                  className={cn(
                    "rounded-md border border-border px-3 py-1.5 text-sm capitalize",
                    state.shape === shape &&
                      "border-primary bg-primary text-primary-foreground",
                  )}
                  onClick={() =>
                    setState((current) => ({ ...current, shape }))
                  }
                  type="button"
                >
                  {t(`shapes.${shape}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">{t("color")}</span>
              <input
                aria-label={t("color")}
                className="h-10 w-full max-w-[5rem] cursor-pointer rounded-md border border-border bg-background"
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    color: event.target.value,
                  }))
                }
                type="color"
                value={state.color}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">{t("metalness")}</span>
              <input
                aria-valuetext={`${Math.round(state.metalness * 100)}%`}
                className="w-full"
                max={1}
                min={0}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    metalness: Number(event.target.value),
                  }))
                }
                step={0.05}
                type="range"
                value={state.metalness}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">{t("roughness")}</span>
              <input
                aria-valuetext={`${Math.round(state.roughness * 100)}%`}
                className="w-full"
                max={1}
                min={0}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    roughness: Number(event.target.value),
                  }))
                }
                step={0.05}
                type="range"
                value={state.roughness}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                checked={state.wireframe}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    wireframe: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              {t("wireframe")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                checked={state.autoRotate}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    autoRotate: event.target.checked,
                  }))
                }
                type="checkbox"
              />
              {t("autoRotate")}
            </label>
          </div>
        </>
      ) : null}

      <Sandbox3dCanvas
        ariaLabel={canvasLabel}
        demo={demo}
        tourView={tourView}
        {...state}
      />
    </section>
  );
}
