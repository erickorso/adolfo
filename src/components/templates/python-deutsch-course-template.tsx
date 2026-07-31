import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import {
  DUAL_TRACK_SECTIONS,
  DUAL_TRACK_WEEK,
  dualLocalized,
} from "@/domain/learning/python-deutsch/track";

export async function PythonDeutschCourseTemplate() {
  const [t, locale] = await Promise.all([
    getTranslations("pythonDeutsch"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <section
        aria-labelledby="about-dual-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <h2 id="about-dual-heading" className="text-lg font-semibold">
          {t("aboutTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("aboutBody")}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("pauseHint")}</p>
      </section>

      <section aria-labelledby="week-heading" className="flex flex-col gap-3">
        <h2 id="week-heading" className="text-xl font-semibold">
          {t("weekTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("weekHint")}</p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  {t("colDay")}
                </th>
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  {t("colMorning")}
                </th>
                <th scope="col" className="px-3 py-2 text-left font-semibold">
                  {t("colEvening")}
                </th>
              </tr>
            </thead>
            <tbody>
              {DUAL_TRACK_WEEK.map((slot) => (
                <tr
                  key={dualLocalized(locale, slot.day)}
                  className="border-b border-border last:border-0"
                >
                  <th
                    scope="row"
                    className="px-3 py-2 text-left font-medium align-top"
                  >
                    {dualLocalized(locale, slot.day)}
                  </th>
                  <td className="px-3 py-2 text-muted-foreground align-top">
                    {dualLocalized(locale, slot.morning)}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground align-top">
                    {dualLocalized(locale, slot.evening)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="sections-heading" className="flex flex-col gap-4">
        <h2 id="sections-heading" className="text-xl font-semibold">
          {t("sectionsTitle")}
        </h2>
        <ul className="flex flex-col gap-3">
          {DUAL_TRACK_SECTIONS.map((section) => (
            <li key={section.slug}>
              <Link
                href={`/learn/python-deutsch/${section.slug}`}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t("sectionLabel", { n: section.order })}
                  </span>
                  <span className="font-medium">
                    {dualLocalized(locale, section.title)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {dualLocalized(locale, section.summary)}
                  </span>
                </span>
                <ChevronRight
                  className="mt-1 size-5 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
