"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import {
  buildMotionCatalogBgItems,
  motionCatalogBgTransform,
  motionCatalogBgVisibility,
  motionCatalogSectionInView,
  motionCatalogSectionProgress,
  pickActiveMotionCatalogSection,
} from "@/domain/learning/motion/motion-catalog-bg";

export function MotionLabCatalogBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => buildMotionCatalogBgItems(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const nodes = container.querySelectorAll<HTMLElement>("[data-motion-bg-item]");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const node of nodes) {
        node.style.setProperty("--motion-bg-opacity-active", "0");
      }
      return;
    }

    const update = () => {
      const viewportWidth = window.innerWidth;
      const sectionStates: Array<{
        sectionId: string;
        progress: number;
        inView: boolean;
      }> = [];

      for (const node of nodes) {
        const sectionId = node.dataset.sectionId;
        if (!sectionId) {
          continue;
        }
        const section = document.getElementById(`motion-${sectionId}`);
        if (!section) {
          continue;
        }
        sectionStates.push({
          sectionId,
          progress: motionCatalogSectionProgress(section),
          inView: motionCatalogSectionInView(section),
        });
      }

      const activeSectionId = pickActiveMotionCatalogSection(sectionStates);
      const stateBySectionId = new Map(
        sectionStates.map((entry) => [entry.sectionId, entry]),
      );

      for (const node of nodes) {
        const sectionId = node.dataset.sectionId;
        if (!sectionId) {
          continue;
        }

        const section = document.getElementById(`motion-${sectionId}`);
        const baseOpacity = Number(node.dataset.baseOpacity ?? 0.24);
        const direction = node.dataset.direction === "rtl" ? "rtl" : "ltr";
        const state = stateBySectionId.get(sectionId);

        if (!section || !state) {
          node.style.setProperty("--motion-bg-opacity-active", "0");
          continue;
        }

        const progress = state.progress;
        const inView = state.inView;
        const isActive = sectionId === activeSectionId;
        const imageWidth = Math.min(
          Number(node.dataset.imageWidth ?? 1000),
          viewportWidth * 0.96,
        );
        const visibility = motionCatalogBgVisibility(progress, inView, isActive);
        const { x, y, rot } = motionCatalogBgTransform(
          direction,
          progress,
          viewportWidth,
          imageWidth,
        );

        node.style.setProperty("--motion-bg-x", `${x}px`);
        node.style.setProperty("--motion-bg-y", `${y}px`);
        node.style.setProperty("--motion-bg-rot", `${rot}deg`);
        node.style.setProperty(
          "--motion-bg-opacity-active",
          String(baseOpacity * visibility),
        );
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="motion-lab__catalog-bg" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.sectionId}
          data-motion-bg-item
          data-section-id={item.sectionId}
          data-direction={item.direction}
          data-base-opacity={item.opacity}
          data-image-width={item.width}
          className={`motion-lab__catalog-bg-item motion-lab__catalog-bg-item--${item.direction}`}
          style={
            {
              "--motion-bg-top": `${item.topVh}vh`,
              "--motion-bg-width": `${item.width}px`,
            } as CSSProperties
          }
        >
          <Image
            src={item.src}
            alt=""
            fill
            sizes="1000px"
            className="motion-lab__catalog-bg-image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
