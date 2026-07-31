import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  getPerfLesson,
  localized,
} from "@/domain/web-performance/lessons";

type WebPerformanceLessonTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function WebPerformanceLessonTemplate({
  params,
}: WebPerformanceLessonTemplateProps) {
  const { slug } = await params;
  const lesson = getPerfLesson(slug);
  if (!lesson) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("webPerformance"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link
          href="/learn/web-performance"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToModule")}
        </Link>
      </nav>

      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("lessonLabel", { n: lesson.order })}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          {localized(locale, lesson.title)}
        </h2>
        <p className="text-muted-foreground">
          {localized(locale, lesson.summary)}
        </p>
      </header>

      <section
        aria-labelledby="tools-heading"
        className="rounded-lg border border-border bg-card p-5"
      >
        <h3 id="tools-heading" className="text-sm font-semibold">
          {t("toolsTitle")}
        </h3>
        <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
          {lesson.tools.map((tool) => (
            <li key={localized(locale, tool)}>{localized(locale, tool)}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-6">
        {lesson.sections.map((section) => (
          <section
            key={localized(locale, section.heading)}
            className="flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold">
              {localized(locale, section.heading)}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {localized(locale, section.body)}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
