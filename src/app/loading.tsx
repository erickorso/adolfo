/**
 * Estado de carga de la home (catálogo). Skeleton simple mientras el Server
 * Component resuelve los datos.
 */
export default function CatalogLoading() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-lg border border-border bg-muted"
          />
        ))}
      </div>
    </main>
  );
}
