"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sandbox3dScene } from "@/components/organisms/sandbox-3d-scene";
import type { Sandbox3dState } from "@/domain/sandbox3d/sandbox3d.types";

type Sandbox3dCanvasProps = Pick<
  Sandbox3dState,
  "shape" | "color" | "wireframe" | "autoRotate" | "metalness" | "roughness"
> & {
  ariaLabel: string;
};

export function Sandbox3dCanvas({
  ariaLabel,
  ...sceneProps
}: Sandbox3dCanvasProps) {
  return (
    <div className="relative h-[min(70vh,520px)] w-full overflow-hidden rounded-xl border border-border bg-muted/30">
      <Canvas
        aria-label={ariaLabel}
        className="h-full w-full touch-none"
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        role="img"
        shadows
      >
        <Suspense fallback={null}>
          <Sandbox3dScene {...sceneProps} />
        </Suspense>
      </Canvas>
    </div>
  );
}
