"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import type { Mesh } from "three";
import type { SandboxShape } from "@/domain/sandbox3d/sandbox3d.types";

export type SandboxPlaygroundSceneProps = {
  shape: SandboxShape;
  color: string;
  wireframe: boolean;
  autoRotate: boolean;
  metalness: number;
  roughness: number;
};

function ShapeGeometry({ shape }: { shape: SandboxShape }) {
  switch (shape) {
    case "sphere":
      return <sphereGeometry args={[0.85, 64, 64]} />;
    case "torus":
      return <torusKnotGeometry args={[0.65, 0.22, 128, 32]} />;
    case "icosahedron":
      return <icosahedronGeometry args={[0.9, 1]} />;
    default:
      return <boxGeometry args={[1.4, 1.4, 1.4]} />;
  }
}

function InteractiveMesh({
  shape,
  color,
  wireframe,
  autoRotate,
  metalness,
  roughness,
}: SandboxPlaygroundSceneProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((frameState, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.position.y = Math.sin(frameState.clock.elapsedTime * 1.1) * 0.1;

    if (autoRotate) {
      mesh.rotation.y += delta * 0.55;
      mesh.rotation.x += delta * 0.12;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <ShapeGeometry shape={shape} />
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

export function SandboxPlaygroundScene(props: SandboxPlaygroundSceneProps) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1.1, 4.2]} fov={45} />
      <OrbitControls
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 1.85}
        minDistance={2}
        maxDistance={9}
      />
      <ambientLight intensity={0.45} />
      <directionalLight castShadow intensity={1.15} position={[4, 7, 5]} />
      <pointLight intensity={0.55} position={[-4, 3, -3]} />
      <InteractiveMesh {...props} />
      <ContactShadows
        blur={2.5}
        opacity={0.5}
        position={[0, -0.82, 0]}
        scale={10}
      />
      <mesh position={[0, -0.82, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </>
  );
}
