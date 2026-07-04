export const MOTION_PRINCIPLE_IDS = [
  "easing",
  "offset",
  "fade",
  "transform",
  "masking",
  "dimension",
  "parallax",
  "zoom",
] as const;

export type MotionPrincipleId = (typeof MOTION_PRINCIPLE_IDS)[number];

export type MotionPrincipleMeta = {
  id: MotionPrincipleId;
  number: number;
};

export const MOTION_PRINCIPLES: MotionPrincipleMeta[] = MOTION_PRINCIPLE_IDS.map(
  (id, index) => ({
    id,
    number: index + 1,
  }),
);

export type EasingPresetId =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "cubic";

export const EASING_PRESETS: EasingPresetId[] = [
  "linear",
  "ease",
  "ease-in",
  "ease-out",
  "cubic",
];
