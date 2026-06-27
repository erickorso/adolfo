"use client";

import { cn } from "@/lib/utils";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import type { SandboxDemoId } from "@/domain/sandbox3d/sandbox3d.types";

type SidebarTab = "description" | "stack";

type Sandbox3dSidebarProps = {
  demo: SandboxDemoId;
};

type StackLayer = {
  id: string;
  title: string;
  summary: string;
  packages?: string[];
};

export function Sandbox3dSidebar({ demo }: Sandbox3dSidebarProps) {
  const t = useTranslations("sandbox3d");
  const baseId = useId();
  const [tab, setTab] = useState<SidebarTab>("description");

  const descriptionTabId = `${baseId}-tab-description`;
  const stackTabId = `${baseId}-tab-stack`;
  const descriptionPanelId = `${baseId}-panel-description`;
  const stackPanelId = `${baseId}-panel-stack`;

  const stackLayers = t.raw("stack.layers") as StackLayer[];
  const concepts = t.raw("stack.concepts") as Array<{
    id: string;
    title: string;
    body: string;
  }>;

  return (
    <aside
      aria-labelledby={`${baseId}-sidebar-title`}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
    >
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold" id={`${baseId}-sidebar-title`}>
          {t("sidebarTitle")}
        </h2>

        <div
          aria-label={t("sidebarTabsLabel")}
          className="flex gap-2"
          role="tablist"
        >
          <button
            aria-controls={descriptionPanelId}
            aria-selected={tab === "description"}
            className={cn(
              "rounded-md border border-border px-3 py-1.5 text-sm",
              tab === "description" &&
                "border-primary bg-primary text-primary-foreground",
            )}
            id={descriptionTabId}
            onClick={() => setTab("description")}
            role="tab"
            type="button"
          >
            {t("tabs.description")}
          </button>
          <button
            aria-controls={stackPanelId}
            aria-selected={tab === "stack"}
            className={cn(
              "rounded-md border border-border px-3 py-1.5 text-sm",
              tab === "stack" &&
                "border-primary bg-primary text-primary-foreground",
            )}
            id={stackTabId}
            onClick={() => setTab("stack")}
            role="tab"
            type="button"
          >
            {t("tabs.stack")}
          </button>
        </div>
      </div>

      <div
        aria-labelledby={descriptionTabId}
        className={cn("flex flex-col gap-3", tab !== "description" && "hidden")}
        id={descriptionPanelId}
        role="tabpanel"
      >
        <h3 className="text-sm font-medium">{t("descriptionTitle")}</h3>
        <p className="text-sm text-muted-foreground">
          {t(`demos.${demo}.intro`)}
        </p>
        <h4 className="text-sm font-medium">{t("capabilitiesTitle")}</h4>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
          {(t.raw(`demos.${demo}.capabilities`) as string[]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div
        aria-labelledby={stackTabId}
        className={cn("flex flex-col gap-4", tab !== "stack" && "hidden")}
        id={stackPanelId}
        role="tabpanel"
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium">{t("stack.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("stack.subtitle")}</p>
        </div>

        <section aria-labelledby={`${baseId}-concepts-title`}>
          <h4 className="text-sm font-medium" id={`${baseId}-concepts-title`}>
            {t("stack.conceptsTitle")}
          </h4>
          <dl className="mt-2 flex flex-col gap-3">
            {concepts.map((concept) => (
              <div key={concept.id}>
                <dt className="text-sm font-medium">{concept.title}</dt>
                <dd className="text-sm text-muted-foreground">{concept.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby={`${baseId}-integration-title`}>
          <h4 className="text-sm font-medium" id={`${baseId}-integration-title`}>
            {t("stack.integrationTitle")}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("stack.integrationIntro")}
          </p>
          <ol className="mt-3 flex flex-col gap-2">
            {stackLayers.map((layer, index) => (
              <li key={layer.id}>
                <article className="rounded-lg border border-border bg-muted/20 p-3">
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                    >
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                      <h5 className="text-sm font-medium">{layer.title}</h5>
                      <p className="text-sm text-muted-foreground">
                        {layer.summary}
                      </p>
                      {layer.packages?.length ? (
                        <ul className="flex flex-wrap gap-1.5 pt-1">
                          {layer.packages.map((pkg) => (
                            <li
                              key={pkg}
                              className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs text-muted-foreground"
                            >
                              {pkg}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </article>
                {index < stackLayers.length - 1 ? (
                  <p
                    aria-hidden="true"
                    className="py-1 text-center text-xs text-muted-foreground"
                  >
                    ↓
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby={`${baseId}-demo-map-title`}>
          <h4 className="text-sm font-medium" id={`${baseId}-demo-map-title`}>
            {t("stack.demoMapTitle")}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`stack.demoMap.${demo}`)}
          </p>
        </section>
      </div>
    </aside>
  );
}
