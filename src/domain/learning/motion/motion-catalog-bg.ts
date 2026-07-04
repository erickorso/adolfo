import { CATALOG_PLACEHOLDER_IMAGE_LIST } from "@/lib/catalog-placeholders";
import { MOTION_PRINCIPLE_IDS } from "@/domain/learning/motion/motion-principles";

export type MotionCatalogBgDirection = "ltr" | "rtl";

export type MotionCatalogBgItem = {
  sectionId: (typeof MOTION_PRINCIPLE_IDS)[number];
  src: string;
  direction: MotionCatalogBgDirection;
  width: number;
  topVh: number;
  opacity: number;
};

export const MOTION_CATALOG_BG_WIDTH = 1000;

/** Ventana central del scroll de sección donde la foto es visible. */
const VISIBILITY_START = 0.18;
const VISIBILITY_END = 0.82;

function seeded(index: number, salt: number): number {
  const value = Math.sin((index + 1) * salt) * 10000;
  return value - Math.floor(value);
}

/** Una imagen grande por capítulo; carriles verticales alternados. */
export function buildMotionCatalogBgItems(): MotionCatalogBgItem[] {
  return MOTION_PRINCIPLE_IDS.map((sectionId, index) => {
    const isLtr = index % 2 === 0;
    const laneJitter = seeded(index, 1.31) * 6;

    return {
      sectionId,
      src: CATALOG_PLACEHOLDER_IMAGE_LIST[index % CATALOG_PLACEHOLDER_IMAGE_LIST.length],
      direction: isLtr ? "ltr" : "rtl",
      width: MOTION_CATALOG_BG_WIDTH,
      topVh: isLtr ? 2 + laneJitter : 46 + laneJitter,
      opacity: 0.18 + seeded(index, 9.47) * 0.08,
    };
  });
}

export function motionCatalogSectionProgress(section: HTMLElement): number {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  const range = rect.height + viewport * 0.55;
  const traveled = viewport * 0.5 - rect.top;
  return Math.min(1, Math.max(0, traveled / range));
}

export function motionCatalogSectionInView(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect();
  const viewport = window.innerHeight;
  return rect.bottom > viewport * 0.05 && rect.top < viewport * 0.95;
}

export function motionCatalogBgTransform(
  direction: MotionCatalogBgDirection,
  progress: number,
  viewportWidth: number,
  imageWidth = MOTION_CATALOG_BG_WIDTH,
): { x: number; y: number; rot: number } {
  const travel = viewportWidth + imageWidth * 0.92;
  const hiddenOffset = imageWidth * 0.94;

  if (direction === "ltr") {
    return {
      x: -hiddenOffset + progress * travel,
      y: -30 + progress * 90,
      rot: -6 + progress * 12,
    };
  }

  return {
    x: viewportWidth - imageWidth * 0.06 - progress * travel,
    y: 50 - progress * 120,
    rot: 10 - progress * 22,
  };
}

/** Solo visible en el tramo central del capítulo (sin solapar vecinos). */
export function motionCatalogBgVisibility(
  progress: number,
  inView: boolean,
  isActive: boolean,
): number {
  if (!inView || !isActive) {
    return 0;
  }
  if (progress < VISIBILITY_START || progress > VISIBILITY_END) {
    return 0;
  }

  const normalized = (progress - VISIBILITY_START) / (VISIBILITY_END - VISIBILITY_START);
  const edgeFade = Math.min(normalized * 5, (1 - normalized) * 5, 1);
  return Math.max(0, edgeFade);
}

export function pickActiveMotionCatalogSection(
  progresses: Array<{ sectionId: string; progress: number; inView: boolean }>,
): string | null {
  let bestId: string | null = null;
  let bestScore = 0;

  for (const entry of progresses) {
    if (!entry.inView) {
      continue;
    }
    if (entry.progress < VISIBILITY_START || entry.progress > VISIBILITY_END) {
      continue;
    }

    const centered = 1 - Math.abs(entry.progress - 0.5) * 2;
    const score = Math.max(0, centered);
    if (score > bestScore) {
      bestScore = score;
      bestId = entry.sectionId;
    }
  }

  return bestId;
}
