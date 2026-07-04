import { CATALOG_PLACEHOLDER_IMAGE_LIST } from "@/lib/catalog-placeholders";

export type MotionCatalogBgEdge = "left" | "right";

export type MotionCatalogBgItem = {
  src: string;
  edge: MotionCatalogBgEdge;
  top: number;
  left: number;
  width: number;
  speedX: number;
  speedY: number;
  baseRotate: number;
  rotateSpeed: number;
  swayPhase: number;
  opacity: number;
};

function seeded(index: number, salt: number): number {
  const value = Math.sin((index + 1) * salt) * 10000;
  return value - Math.floor(value);
}

function buildEdgeItem(
  src: string,
  index: number,
  edge: MotionCatalogBgEdge,
): MotionCatalogBgItem {
  const jitter = seeded(index, 2.41);
  const isLeft = edge === "left";

  return {
    src,
    edge,
    top: 4 + seeded(index, 1.17) * 88,
    left: isLeft ? -14 - jitter * 12 : 78 + jitter * 14,
    width: 160 + seeded(index, 3.83) * 120,
    speedX: isLeft ? 0.04 + jitter * 0.12 : -(0.04 + jitter * 0.12),
    speedY: 0.03 + seeded(index, 5.61) * 0.14,
    baseRotate: isLeft ? -14 - jitter * 12 : 14 + jitter * 12,
    rotateSpeed: isLeft ? 0.02 + jitter * 0.03 : -(0.02 + jitter * 0.03),
    swayPhase: seeded(index, 8.91) * Math.PI * 2,
    opacity: 0.16 + seeded(index, 9.47) * 0.14,
  };
}

/** Imágenes asomadas desde los bordes, rotadas hacia afuera. */
export function buildMotionCatalogBgItems(): MotionCatalogBgItem[] {
  return CATALOG_PLACEHOLDER_IMAGE_LIST.map((src, index) =>
    buildEdgeItem(src, index, index % 2 === 0 ? "left" : "right"),
  );
}
