"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CameraControls,
  PerspectiveCamera,
} from "@react-three/drei";
import type { CameraControls as CameraControlsImpl } from "@react-three/drei";
import * as THREE from "three";
import {
  TOUR_VIEWPOINTS,
  type TourViewpointId,
} from "@/domain/sandbox3d/sandbox3d.types";

const TOUR_VIDEO_SRC = "/videos/tour-demo.mp4";

type SandboxTourSceneProps = {
  activeView: TourViewpointId;
};

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
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function Block({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh castShadow position={position} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.78} />
    </mesh>
  );
}

function VideoScreen() {
  const gl = useThree((state) => state.gl);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = TOUR_VIDEO_SRC;

    const handleCanPlay = () => {
      const nextTexture = new THREE.VideoTexture(video);
      nextTexture.colorSpace = gl.outputColorSpace;
      textureRef.current = nextTexture;
      setTexture(nextTexture);
      void video.play().catch(() => undefined);
    };

    video.addEventListener("canplay", handleCanPlay, { once: true });
    video.load();

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      textureRef.current?.dispose();
      textureRef.current = null;
    };
  }, [gl]);

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 1.35, -3.48]}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[2.75, 1.6, 0.08]} />
        <meshStandardMaterial color="#1c1917" roughness={0.6} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.6, 1.45]} />
        {texture ? (
          <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            color="#292524"
            emissive="#44403c"
            emissiveIntensity={0.35}
          />
        )}
      </mesh>
    </group>
  );
}

function applyViewpoint(
  controls: CameraControlsImpl,
  activeView: TourViewpointId,
  animate: boolean,
) {
  const viewpoint = TOUR_VIEWPOINTS.find((item) => item.id === activeView);
  if (!viewpoint) return;

  void controls.setLookAt(
    ...viewpoint.position,
    ...viewpoint.target,
    animate,
  );
}

function TourControls({ activeView }: { activeView: TourViewpointId }) {
  const [controls, setControls] = useState<CameraControlsImpl | null>(null);
  const isFirstViewRef = useRef(true);

  useEffect(() => {
    if (!controls) return;

    applyViewpoint(controls, activeView, !isFirstViewRef.current);
    isFirstViewRef.current = false;
  }, [activeView, controls]);

  return (
    <CameraControls
      ref={setControls}
      maxDistance={8}
      minDistance={1.5}
      smoothTime={0.45}
    />
  );
}

export function SandboxTourScene({ activeView }: SandboxTourSceneProps) {
  const initial = TOUR_VIEWPOINTS[0];

  return (
    <>
      <color attach="background" args={["#e7e5e4"]} />
      <PerspectiveCamera makeDefault fov={55} position={initial.position} />
      <TourControls activeView={activeView} />
      <ambientLight intensity={0.32} />
      <directionalLight castShadow intensity={0.9} position={[5, 8, 4]} />
      <pointLight color="#fde68a" intensity={0.9} position={[0, 2.2, 1.5]} />

      <mesh position={[0, 0, -1]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.95} />
      </mesh>

      <Wall color="#f5f5f4" position={[0, 1.6, -3.5]} size={[7, 3.2]} />
      <Wall
        color="#e7e5e4"
        position={[-3.5, 1.6, -1]}
        rotation={[0, Math.PI / 2, 0]}
        size={[5, 3.2]}
      />
      <Wall
        color="#e7e5e4"
        position={[3.5, 1.6, -1]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[5, 3.2]}
      />
      <Wall
        color="#f5f5f4"
        position={[0, 1.6, 1.5]}
        rotation={[0, Math.PI, 0]}
        size={[7, 3.2]}
      />

      <Wall
        color="#fafaf9"
        position={[-3.5, 1.6, -4.5]}
        rotation={[0, Math.PI / 2, 0]}
        size={[4, 3.2]}
      />
      <Wall color="#fafaf9" position={[-1.5, 1.6, -6.5]} size={[4, 3.2]} />

      <Block color="#44403c" position={[0, 0.35, -1.2]} size={[2.2, 0.7, 0.9]} />
      <Block color="#292524" position={[0, 0.75, -1.65]} size={[2.4, 0.08, 0.5]} />
      <Block color="#78716c" position={[-3.2, 0.35, -2.5]} size={[2.2, 0.7, 2]} />
      <Block color="#e7e5e4" position={[-3.2, 0.72, -2.5]} size={[2.1, 0.12, 1.9]} />
      <Block color="#57534e" position={[3, 0.9, -3.2]} size={[1.2, 1.8, 0.6]} />
      <Block color="#a8a29e" position={[3.2, 0.45, -2.2]} size={[1.4, 0.9, 0.55]} />
      <Block color="#78350f" position={[1.8, 0.45, -4.8]} size={[1.6, 0.9, 0.7]} />
      <Block color="#57534e" position={[1.8, 0.95, -5.15]} size={[1.6, 0.06, 0.06]} />

      <VideoScreen />
    </>
  );
}
