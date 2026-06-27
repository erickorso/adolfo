"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sandbox3dSidebar } from "@/components/molecules/sandbox-3d-sidebar";
import type { SandboxDemoId } from "@/domain/sandbox3d/sandbox3d.types";

function Sandbox3dLoading() {
  const t = useTranslations("sandbox3d");
  return (
    <div
      aria-busy="true"
      className="flex h-[min(70vh,520px)] items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground"
    >
      {t("loading")}
    </div>
  );
}

const Sandbox3dControls = dynamic(
  () =>
    import("@/components/molecules/sandbox-3d-controls").then(
      (module) => module.Sandbox3dControls,
    ),
  {
    loading: () => <Sandbox3dLoading />,
    ssr: false,
  },
);

export function Sandbox3dPageClient() {
  const [demo, setDemo] = useState<SandboxDemoId>("playground");

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
      <Sandbox3dControls demo={demo} onDemoChange={setDemo} />

      <Sandbox3dSidebar demo={demo} />
    </div>
  );
}
