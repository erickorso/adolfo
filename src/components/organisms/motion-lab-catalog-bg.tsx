"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { buildMotionCatalogBgItems } from "@/domain/learning/motion/motion-catalog-bg";

export function MotionLabCatalogBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => buildMotionCatalogBgItems(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const nodes = container.querySelectorAll<HTMLElement>("[data-motion-bg-item]");
    for (const node of nodes) {
      node.style.setProperty("--motion-bg-x", "0px");
      node.style.setProperty("--motion-bg-y", "0px");
      node.style.setProperty("--motion-bg-rot", `${node.dataset.baseRotate ?? "0"}deg`);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const update = () => {
      const scrollY = window.scrollY;
      for (const node of nodes) {
        const speedX = Number(node.dataset.speedX ?? 0);
        const speedY = Number(node.dataset.speedY ?? 0);
        const rotateSpeed = Number(node.dataset.rotateSpeed ?? 0);
        const baseRotate = Number(node.dataset.baseRotate ?? 0);
        const swayPhase = Number(node.dataset.swayPhase ?? 0);
        const swayX = Math.sin(scrollY * 0.003 + swayPhase) * 22;
        const swayY = Math.cos(scrollY * 0.0025 + swayPhase) * 16;
        const x = scrollY * speedX + swayX;
        const y = scrollY * speedY + swayY;
        const rot = baseRotate + scrollY * rotateSpeed;
        node.style.setProperty("--motion-bg-x", `${x}px`);
        node.style.setProperty("--motion-bg-y", `${y}px`);
        node.style.setProperty("--motion-bg-rot", `${rot}deg`);
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
          key={item.src}
          data-motion-bg-item
          data-speed-x={item.speedX}
          data-speed-y={item.speedY}
          data-rotate-speed={item.rotateSpeed}
          data-base-rotate={item.baseRotate}
          data-sway-phase={item.swayPhase}
          className={`motion-lab__catalog-bg-item motion-lab__catalog-bg-item--edge-${item.edge}`}
          style={
            {
              "--motion-bg-top": `${item.top}vh`,
              "--motion-bg-left": `${item.left}vw`,
              "--motion-bg-width": `${item.width}px`,
              "--motion-bg-opacity": String(item.opacity),
            } as CSSProperties
          }
        >
          <Image
            src={item.src}
            alt=""
            fill
            sizes="200px"
            className="motion-lab__catalog-bg-image"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
