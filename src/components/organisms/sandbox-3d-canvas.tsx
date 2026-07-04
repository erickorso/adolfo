"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sandbox3dScene } from "@/components/organisms/sandbox-3d-scene";
import type { Sandbox3dCanvasProps } from "@/domain/sandbox3d/sandbox3d.types";

export function Sandbox3dCanvas(props: Sandbox3dCanvasProps) {
  const {
    ariaLabel,
    demo,
    tourView,
    shape,
    color,
    wireframe,
    autoRotate,
    metalness,
    roughness,
  } = props;
  return (
    <div className="relative h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-border bg-muted/30">
      <Canvas
        aria-label={ariaLabel}
        className="h-full w-full touch-none"
        dpr={[1, 2]}
        gl={{ alpha: demo !== "tour", antialias: true }}
        role="img"
        shadows
      >
        <Suspense fallback={null}>
          <Sandbox3dScene
            key={demo}
            demo={demo}
            tourView={tourView}
            shape={shape}
            color={color}
            wireframe={wireframe}
            autoRotate={autoRotate}
            metalness={metalness}
            roughness={roughness}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
