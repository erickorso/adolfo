import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FpCertificateCard } from "@/components/molecules/fp-certificate-card";
import { FpSearchForm } from "@/components/molecules/fp-search-form";
import type { FpCertificateVM } from "@/domain/fp/fp.vm";

type FpCatalogTemplateProps = {
  items: FpCertificateVM[];
  total: number;
  initialQuery: {
    q?: string;
    level?: string;
    bachiller?: string;
  };
};

export async function FpCatalogTemplate({
  items,
  total,
  initialQuery,
}: FpCatalogTemplateProps) {
  const t = await getTranslations("fp");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <Link href="/courses" className="text-sm text-muted-foreground underline">
        {t("backToCourses")}
      </Link>
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
          {t("badge")}
        </p>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
        <p className="text-sm text-muted-foreground">
          {t("resultCount", { count: items.length, total })}
        </p>
      </header>

      <FpSearchForm initialQuery={initialQuery} />

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="flex">
              <div className="w-full">
                <FpCertificateCard item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
