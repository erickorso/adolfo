"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function Wall({
  position,
  rotation,
  size,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
  color: string;
}) {
  return (
    <mesh position={position} receiveShadow rotation={rotation ?? [0, 0, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  );
}

function FurnitureBlock({
  position,
  size,
  color,
  metalness = 0.05,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  metalness?: number;
}) {
  return (
    <mesh castShadow position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={0.75} />
    </mesh>
  );
}

export function SandboxRoomScene() {
  return (
    <>
      <PerspectiveCamera makeDefault fov={50} position={[0, 1.55, 4.2]} />
      <OrbitControls
        enablePan
        enableZoom
        maxDistance={6}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2.2}
        target={[0, 1, 0]}
      />
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        intensity={0.85}
        position={[2, 5, 3]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#ffd9a8" intensity={1.2} position={[-1.8, 2.1, -0.4]} />
      <pointLight color="#fff5e6" intensity={0.7} position={[1.6, 2.4, -1.2]} />

      <mesh position={[0, 0, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 4.5]} />
        <meshStandardMaterial color="#c9b8a3" roughness={0.95} />
      </mesh>

      <Wall color="#f3ece3" position={[0, 1.5, -2.25]} size={[5.5, 3]} />
      <Wall
        color="#ebe3d8"
        position={[-2.75, 1.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[4.5, 3]}
      />
      <Wall
        color="#ebe3d8"
        position={[2.75, 1.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[4.5, 3]}
      />

      <mesh position={[2.35, 1.55, -0.2]}>
        <planeGeometry args={[1.1, 1.4]} />
        <meshStandardMaterial
          color="#dbeafe"
          emissive="#87ceeb"
          emissiveIntensity={0.75}
        />
      </mesh>

      <FurnitureBlock color="#4f46e5" position={[-1.4, 0.35, -1.3]} size={[2, 0.7, 2.2]} />
      <FurnitureBlock color="#f8fafc" position={[-1.4, 0.75, -1.3]} size={[1.9, 0.15, 2.1]} />
      <FurnitureBlock color="#78350f" position={[1.5, 0.4, -1.6]} size={[1.4, 0.8, 0.65]} />
      <FurnitureBlock color="#78350f" position={[1.5, 0.85, -1.95]} size={[1.4, 0.05, 0.05]} />
      <FurnitureBlock color="#57534e" position={[1.5, 0.45, -1.1]} size={[0.45, 0.5, 0.45]} />
      <FurnitureBlock color="#292524" position={[0.2, 0.25, 0.6]} size={[1.6, 0.08, 0.9]} metalness={0.2} />
      <FurnitureBlock color="#44403c" position={[0.2, 0.45, 0.95]} size={[1.5, 0.5, 0.08]} />
      <FurnitureBlock color="#a8a29e" position={[-0.5, 0.55, -0.2]} size={[0.35, 0.55, 0.35]} />
      <FurnitureBlock color="#fde68a" position={[1.8, 1.05, -1.55]} size={[0.2, 0.5, 0.2]} metalness={0.4} />
    </>
  );
}
