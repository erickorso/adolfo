import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  dualLocalized,
  getDualTrackSection,
} from "@/domain/learning/python-deutsch/track";

type PythonDeutschSectionTemplateProps = {
  params: Promise<{ slug: string }>;
};

export async function PythonDeutschSectionTemplate({
  params,
}: PythonDeutschSectionTemplateProps) {
  const { slug } = await params;
  const section = getDualTrackSection(slug);
  if (!section) {
    notFound();
  }

  const [t, locale] = await Promise.all([
    getTranslations("pythonDeutsch"),
    getLocale(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <nav>
        <Link
          href="/learn/python-deutsch"
          className="text-sm text-muted-foreground underline"
        >
          {t("backToModule")}
        </Link>
      </nav>

      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("sectionLabel", { n: section.order })}
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          {dualLocalized(locale, section.title)}
        </h2>
        <p className="text-muted-foreground">
          {dualLocalized(locale, section.summary)}
        </p>
      </header>

      <div className="flex flex-col gap-8">
        {section.blocks.map((block) => (
          <section
            key={dualLocalized(locale, block.heading)}
            className="flex flex-col gap-2"
          >
            <h3 className="text-lg font-semibold">
              {dualLocalized(locale, block.heading)}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dualLocalized(locale, block.body)}
            </p>
            {block.bullets?.length ? (
              <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                {block.bullets.map((b) => (
                  <li key={dualLocalized(locale, b)}>
                    {dualLocalized(locale, b)}
                  </li>
                ))}
              </ul>
            ) : null}
            {block.links?.length ? (
              <ul className="mt-2 flex flex-col gap-1 text-sm">
                {block.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline"
                    >
                      {dualLocalized(locale, link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
