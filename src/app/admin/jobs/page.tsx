import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listAllJobs } from "@/services/admin/moderation.service";
import { setJobHiddenAction } from "@/app/admin/actions";

/** Moderación de empleos: ocultar / mostrar vacantes del listado público. */
export default async function AdminJobsPage() {
  const jobs = await listAllJobs();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Empleos ({jobs.length})</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Título</th>
              <th className="px-3 py-2 font-medium">Empresa</th>
              <th className="px-3 py-2 font-medium">Fuente</th>
              <th className="px-3 py-2 font-medium">Estado</th>
              <th className="px-3 py-2 font-medium">Acción</th>
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
                    {j.hidden ? "Oculta" : "Visible"}
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
                      {j.hidden ? "Mostrar" : "Ocultar"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            No hay vacantes ingestadas todavía.
          </p>
        ) : null}
      </div>
    </div>
  );
}
