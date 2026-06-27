export type SandboxDemoId = "playground" | "room" | "tour";

export type SandboxShape = "box" | "sphere" | "torus" | "icosahedron";

export type Sandbox3dState = {
  shape: SandboxShape;
  color: string;
  wireframe: boolean;
  autoRotate: boolean;
  metalness: number;
  roughness: number;
};

export const DEFAULT_SANDBOX_3D_STATE: Sandbox3dState = {
  shape: "torus",
  color: "#6366f1",
  wireframe: false,
  autoRotate: true,
  metalness: 0.35,
  roughness: 0.25,
};

export type Sandbox3dCanvasProps = Sandbox3dState & {
  demo: SandboxDemoId;
  tourView: TourViewpointId;
  ariaLabel: string;
};

export const SANDBOX_DEMO_IDS: SandboxDemoId[] = ["playground", "room", "tour"];

export type TourViewpointId = "living" | "bedroom" | "kitchen";

export type TourViewpoint = {
  id: TourViewpointId;
  position: [number, number, number];
  target: [number, number, number];
};

export const TOUR_VIEWPOINTS: TourViewpoint[] = [
  {
    id: "living",
    position: [4.2, 1.65, 3.5],
    target: [0, 1.2, -0.5],
  },
  {
    id: "bedroom",
    position: [-3.8, 1.55, 1.2],
    target: [-3.5, 0.9, -2.2],
  },
  {
    id: "kitchen",
    position: [1.5, 1.6, -4.5],
    target: [3.5, 1, -3],
  },
];
