import { getLocale, getTranslations } from "next-intl/server";
import { ApisCatalogTemplate } from "@/components/templates/apis-catalog-template";
import { API_CATALOG_ENTRIES } from "@/domain/api-catalog/entries";
import { runPublicApiProbes } from "@/services/api-catalog/probe-public-apis";

export default async function ApisPage() {
  const [t, locale, report] = await Promise.all([
    getTranslations("apis"),
    getLocale(),
    runPublicApiProbes(),
  ]);

  const probeById = new Map(report.probes.map((probe) => [probe.id, probe]));

  return (
    <ApisCatalogTemplate
      title={t("title")}
      subtitle={t("subtitle")}
      checkedAt={report.checkedAt}
      allOk={report.allOk}
      failedCount={report.failedCount}
      internalSection={t("sections.internal")}
      externalSection={t("sections.external")}
      statusOk={t("status.ok")}
      statusError={t("status.error")}
      latencyLabel={t("latency")}
      upstreamLabel={t("upstream")}
      tryLabel={t("try")}
      sandboxLabel={t("sandbox")}
      postmanLabel={t("postman")}
      postmanHref="https://github.com/erickorso/adolfo/blob/main/postman/adolfo-nine.postman_collection.json"
      entries={API_CATALOG_ENTRIES.map((entry) => ({
        ...entry,
        description: entry.description[locale === "es" ? "es" : "en"],
        probe: probeById.get(entry.id),
      }))}
    />
  );
}
