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
