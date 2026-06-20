import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listAllJobs } from "@/services/admin/moderation.service";
import { setJobHiddenAction } from "@/app/[locale]/admin/actions";

/** Moderación de empleos: ocultar / mostrar vacantes del listado público. */
export default async function AdminJobsPage() {
  const jobs = await listAllJobs();
  const t = await getTranslations("admin");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">
        {t("jobs")} ({jobs.length})
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">{t("title2")}</th>
              <th className="px-3 py-2 font-medium">{t("company")}</th>
              <th className="px-3 py-2 font-medium">{t("source")}</th>
              <th className="px-3 py-2 font-medium">{t("status")}</th>
              <th className="px-3 py-2 font-medium">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="px-3 py-2">{j.title}</td>
                <td className="px-3 py-2">{j.company}</td>
                <td className="px-3 py-2 text-muted-foreground">{j.source}</td>
                <td className="px-3 py-2">
                  <Badge variant={j.hidden ? "destructive" : "secondary"}>
                    {j.hidden ? t("hidden") : t("visible")}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <form action={setJobHiddenAction}>
                    <input type="hidden" name="id" value={j.id} />
                    <input
                      type="hidden"
                      name="hidden"
                      value={j.hidden ? "false" : "true"}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {j.hidden ? t("show") : t("hide")}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">{t("noJobs")}</p>
        ) : null}
      </div>
    </div>
  );
}
