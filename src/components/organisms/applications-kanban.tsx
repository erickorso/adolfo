"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { updateJobApplicationStatusAction } from "@/app/[locale]/account/applications/actions";
import { ApplicationKanbanCard } from "@/components/molecules/application-kanban-card";
import {
  KANBAN_COLUMNS,
  type JobApplicationVM,
} from "@/domain/job-applications/job-application.types";

type ApplicationsKanbanProps = {
  applications: JobApplicationVM[];
};

/** Tablero Kanban con drag-and-drop entre columnas del pipeline. */
export function ApplicationsKanban({ applications }: ApplicationsKanbanProps) {
  const t = useTranslations("applications");
  const router = useRouter();
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const moveCard = useCallback(
    async (applicationId: string, status: string) => {
      const formData = new FormData();
      formData.set("applicationId", applicationId);
      formData.set("status", status);
      await updateJobApplicationStatusAction(formData);
      router.refresh();
    },
    [router],
  );

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2"
      role="region"
      aria-label={t("kanbanTitle")}
    >
      {KANBAN_COLUMNS.map((column) => {
        const cards = applications.filter((app) =>
          column.statuses.includes(app.status),
        );

        return (
          <div
            key={column.id}
            className="flex w-56 shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2"
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              const id =
                event.dataTransfer.getData("application/id") || draggingId;
              if (id) {
                void moveCard(id, column.dropStatus);
              }
              setDraggingId(null);
            }}
          >
            <header className="flex items-center justify-between px-1 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`column_${column.id}`)}
              </h3>
              <span
                className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                aria-label={t("cardCount", { count: cards.length })}
              >
                {cards.length}
              </span>
            </header>

            <ul className="flex min-h-24 flex-col gap-2">
              {cards.map((application) => (
                <li key={application.id}>
                  <ApplicationKanbanCard
                    application={application}
                    isDragging={draggingId === application.id}
                    onDragStart={() => setDraggingId(application.id)}
                    onDragEnd={() => setDraggingId(null)}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
