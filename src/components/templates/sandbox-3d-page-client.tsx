"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("sandbox3d");

  const concepts = [
    t("concepts.webgl"),
    t("concepts.three"),
    t("concepts.r3f"),
    t("concepts.materials"),
    t("concepts.performance"),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <Sandbox3dControls />

      <aside
        aria-labelledby="sandbox3d-concepts-title"
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
      >
        <div>
          <h2 className="text-lg font-semibold" id="sandbox3d-concepts-title">
            {t("conceptsTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("conceptsSubtitle")}</p>
        </div>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
          {concepts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium">{t("interviewTitle")}</p>
          <p className="mt-2 text-muted-foreground">{t("interviewHint")}</p>
        </div>
      </aside>
    </div>
  );
}
