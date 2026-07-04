"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { MotionPrincipleId } from "@/domain/learning/motion/motion-principles";
import { MotionLabEasingDemo } from "@/components/molecules/motion-lab-easing-demo";
import { MotionLabHorizontalSlideDemo } from "@/components/molecules/motion-lab-horizontal-slide-demo";
import { useParallaxOffset } from "@/hooks/use-parallax-offset";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

type MotionLabPrincipleSectionProps = {
  id: MotionPrincipleId;
  number: number;
};

function StaggerDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const items = t.raw("offset.items") as string[];

  return (
    <div ref={ref} className="motion-lab__demo">
      <div className="motion-lab__stagger-list" aria-live="polite">
        {items.map((label) => (
          <div
            key={label}
            className={cn(
              "motion-lab__stagger-item",
              visible && "motion-lab__stagger-item--visible",
            )}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function FadeDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="motion-lab__demo">
      <div
        className={cn(
          "motion-lab__fade-panel",
          visible && "motion-lab__fade-panel--visible",
        )}
      >
        {t("fade.demoText")}
      </div>
    </div>
  );
}

function TransformDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="motion-lab__demo">
      <div
        className={cn(
          "motion-lab__morph-box",
          visible && "motion-lab__morph-box--expanded",
        )}
        aria-label={t("transform.demoLabel")}
      >
        {visible ? t("transform.demoExpanded") : t("transform.demoCompact")}
      </div>
    </div>
  );
}

function MaskDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="motion-lab__demo motion-lab__mask-frame">
      <div
        className={cn(
          "motion-lab__mask-fill",
          visible && "motion-lab__mask-fill--visible",
        )}
        aria-hidden="true"
      />
      <div className="motion-lab__mask-label">{t("masking.demoText")}</div>
    </div>
  );
}

function DimensionDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const cards = t.raw("dimension.cards") as string[];

  return (
    <div ref={ref} className="motion-lab__demo">
      <div
        className={cn(
          "motion-lab__dimension-stack",
          visible && "motion-lab__dimension-stack--hover",
        )}
        aria-label={t("dimension.demoLabel")}
      >
        <div className="motion-lab__dimension-card motion-lab__dimension-card--back">
          {cards[0]}
        </div>
        <div className="motion-lab__dimension-card motion-lab__dimension-card--mid">
          {cards[1]}
        </div>
        <div className="motion-lab__dimension-card motion-lab__dimension-card--front">
          {cards[2]}
        </div>
      </div>
    </div>
  );
}

function ParallaxDemo() {
  const t = useTranslations("motionLab");
  const offset = useParallaxOffset(0.18);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sceneRef.current;
    if (!node) {
      return;
    }
    node.style.setProperty("--motion-parallax-far", `${offset * 0.35}px`);
    node.style.setProperty("--motion-parallax-mid", `${offset * 0.65}px`);
    node.style.setProperty("--motion-parallax-near", `${offset}px`);
  }, [offset]);

  return (
    <div
      ref={sceneRef}
      className="motion-lab__demo motion-lab__parallax-scene"
      aria-label={t("parallax.demoLabel")}
    >
      <div className="motion-lab__parallax-layer motion-lab__parallax-layer--far">
        {t("parallax.layers.far")}
      </div>
      <div className="motion-lab__parallax-layer motion-lab__parallax-layer--mid">
        {t("parallax.layers.mid")}
      </div>
      <div className="motion-lab__parallax-layer motion-lab__parallax-layer--near">
        {t("parallax.layers.near")}
      </div>
    </div>
  );
}

function ZoomDemo() {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="motion-lab__demo motion-lab__zoom-stage">
      <div
        className={cn(
          "motion-lab__zoom-card",
          visible && "motion-lab__zoom-card--visible",
        )}
      >
        {t("zoom.demoText")}
      </div>
    </div>
  );
}

function PrincipleDemo({ id }: { id: MotionPrincipleId }) {
  switch (id) {
    case "easing":
      return <MotionLabEasingDemo />;
    case "offset":
      return <StaggerDemo />;
    case "fade":
      return <FadeDemo />;
    case "transform":
      return <TransformDemo />;
    case "masking":
      return <MaskDemo />;
    case "dimension":
      return <DimensionDemo />;
    case "parallax":
      return <ParallaxDemo />;
    case "zoom":
      return <ZoomDemo />;
    case "slideX":
      return <MotionLabHorizontalSlideDemo />;
    default:
      return null;
  }
}

export function MotionLabPrincipleSection({
  id,
  number,
}: MotionLabPrincipleSectionProps) {
  const t = useTranslations("motionLab");
  const { ref, visible } = useScrollReveal<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id={`motion-${id}`}
      className={cn(
        "motion-lab__section",
        id === "slideX" && "motion-lab__section--slide-x",
      )}
      aria-labelledby={`motion-${id}-title`}
    >
      <header
        className={cn(
          "motion-lab__section-header motion-lab__scroll-reveal",
          visible && "motion-lab__scroll-reveal--visible",
        )}
      >
        <span className="motion-lab__section-index">
          {String(number).padStart(2, "0")}
        </span>
        <h2 id={`motion-${id}-title`} className="motion-lab__section-title">
          {t(`principles.${id}.title`)}
        </h2>
        <p className="motion-lab__section-body">{t(`principles.${id}.body`)}</p>
      </header>
      <PrincipleDemo id={id} />
    </section>
  );
}
