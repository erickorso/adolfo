"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { JobApplicationVM } from "@/domain/job-applications/job-application.types";
import { cn } from "@/lib/utils";

type ApplicationKanbanCardProps = {
  application: JobApplicationVM;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
};

/** Tarjeta Kanban arrastrable con link al detalle. */
export function ApplicationKanbanCard({
  application,
  isDragging,
  onDragStart,
  onDragEnd,
}: ApplicationKanbanCardProps) {
  const t = useTranslations("applications");

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("application/id", application.id);
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-grab rounded-lg border border-border bg-background p-3 shadow-sm active:cursor-grabbing",
        isDragging && "opacity-50 ring-2 ring-ring",
      )}
    >
      <Link
        href={`/account/applications/${application.id}`}
        className="flex flex-col gap-1 hover:underline"
        draggable={false}
      >
        <span className="font-medium leading-tight">{application.company}</span>
        <span className="text-xs text-muted-foreground">{application.title}</span>
        {application.source ? (
          <span className="text-xs text-muted-foreground">{application.source}</span>
        ) : null}
        {application.nextStep ? (
          <span className="mt-1 line-clamp-2 text-xs text-foreground">
            → {application.nextStep}
          </span>
        ) : null}
      </Link>
      <span className="mt-2 block text-[10px] text-muted-foreground">
        {t("viewDetail")}
      </span>
    </article>
  );
}
