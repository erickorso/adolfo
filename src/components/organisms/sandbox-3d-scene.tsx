"use client";

import { SandboxPlaygroundScene } from "@/components/organisms/sandbox-3d-playground-scene";
import type { SandboxPlaygroundSceneProps } from "@/components/organisms/sandbox-3d-playground-scene";
import { SandboxRoomScene } from "@/components/organisms/sandbox-3d-room-scene";
import { SandboxTourScene } from "@/components/organisms/sandbox-3d-tour-scene";
import type {
  SandboxDemoId,
  TourViewpointId,
} from "@/domain/sandbox3d/sandbox3d.types";

type Sandbox3dSceneProps = SandboxPlaygroundSceneProps & {
  demo: SandboxDemoId;
  tourView: TourViewpointId;
};

export function Sandbox3dScene({
  demo,
  tourView,
  ...playgroundProps
}: Sandbox3dSceneProps) {
  switch (demo) {
    case "room":
      return <SandboxRoomScene />;
    case "tour":
      return <SandboxTourScene activeView={tourView} />;
    default:
      return <SandboxPlaygroundScene {...playgroundProps} />;
  }
}
