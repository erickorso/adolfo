import { getTranslations } from "next-intl/server";
import type { FpCertificateVM } from "@/domain/fp/fp.vm";

type FpCertificateCardProps = {
  item: FpCertificateVM;
};

export async function FpCertificateCard({ item }: FpCertificateCardProps) {
  const t = await getTranslations("fp");

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-muted px-2 py-0.5 font-mono font-medium">
          {item.externalId}
        </span>
        {item.family ? (
          <span className="text-muted-foreground">{item.family}</span>
        ) : null}
        <span className="rounded bg-teal-100 px-2 py-0.5 font-medium text-teal-900 dark:bg-teal-950 dark:text-teal-200">
          {t("levelBadge", { level: item.level })}
        </span>
        <span
          className={
            item.requiresBachiller
              ? "rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200"
              : "rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
          }
        >
          {item.requiresBachiller ? t("badgeBachillerYes") : t("badgeBachillerNo")}
        </span>
      </div>
      <h2 className="mt-2 text-base font-semibold leading-snug">{item.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{item.provider}</p>
      {item.description ? (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {item.description}
        </p>
      ) : null}
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <div>
          <dt className="sr-only">{t("hours")}</dt>
          <dd>
            {item.hours} {t("hoursUnit")}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t("modality")}</dt>
          <dd>{item.modality}</dd>
        </div>
      </dl>
      <div className="mt-auto flex flex-wrap gap-3 pt-4">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium underline"
        >
          {t("openSepe")}
        </a>
        {item.programUrl ? (
          <a
            href={item.programUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline"
          >
            {t("openProgram")}
          </a>
        ) : null}
      </div>
    </article>
  );
}
