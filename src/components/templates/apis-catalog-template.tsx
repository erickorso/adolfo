import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { ApiCatalogEntry, ApiProbeResult } from "@/domain/api-catalog/types";
import { cn } from "@/lib/utils";

type CatalogRow = Omit<ApiCatalogEntry, "description"> & {
  description: string;
  probe?: ApiProbeResult;
};

type ApisCatalogTemplateProps = {
  title: string;
  subtitle: string;
  checkedAt: string;
  allOk: boolean;
  failedCount: number;
  internalSection: string;
  externalSection: string;
  statusOk: string;
  statusError: string;
  latencyLabel: string;
  upstreamLabel: string;
  tryLabel: string;
  sandboxLabel: string;
  postmanLabel: string;
  postmanHref: string;
  entries: CatalogRow[];
};

function ApiSection({
  heading,
  entries,
  statusOk,
  statusError,
  latencyLabel,
  upstreamLabel,
  tryLabel,
  sandboxLabel,
}: {
  heading: string;
  entries: CatalogRow[];
  statusOk: string;
  statusError: string;
  latencyLabel: string;
  upstreamLabel: string;
  tryLabel: string;
  sandboxLabel: string;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby={`apis-${heading}`}>
      <h2 id={`apis-${heading}`} className="text-xl font-semibold">
        {heading}
      </h2>
      <ul className="flex flex-col gap-4">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <ApiCard
              entry={entry}
              statusOk={statusOk}
              statusError={statusError}
              latencyLabel={latencyLabel}
              upstreamLabel={upstreamLabel}
              tryLabel={tryLabel}
              sandboxLabel={sandboxLabel}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApiCard({
  entry,
  statusOk,
  statusError,
  latencyLabel,
  upstreamLabel,
  tryLabel,
  sandboxLabel,
}: {
  entry: CatalogRow;
  statusOk: string;
  statusError: string;
  latencyLabel: string;
  upstreamLabel: string;
  tryLabel: string;
  sandboxLabel: string;
}) {
  const probe = entry.probe;
  const ok = probe?.ok ?? false;

  return (
    <article className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-medium">{entry.name}</h3>
        <Badge variant={ok ? "default" : "destructive"}>
          {ok ? statusOk : statusError}
        </Badge>
        {probe && probe.latencyMs > 0 ? (
          <span className="text-xs text-muted-foreground">
            {latencyLabel}: {probe.latencyMs} ms
          </span>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">{entry.description}</p>

      {probe ? (
        <p
          className={cn(
            "font-mono text-xs",
            ok ? "text-muted-foreground" : "text-destructive",
          )}
        >
          {probe.message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 text-sm">
        {entry.path ? (
          <a
            href={entry.path}
            className="text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {tryLabel}: {entry.method ?? "GET"} {entry.path}
          </a>
        ) : null}
        {entry.upstreamUrl ? (
          <a
            href={entry.upstreamUrl}
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {upstreamLabel}
          </a>
        ) : null}
        {entry.sandboxPath ? (
          <Link
            href={entry.sandboxPath}
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {sandboxLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export function ApisCatalogTemplate({
  title,
  subtitle,
  checkedAt,
  allOk,
  failedCount,
  internalSection,
  externalSection,
  statusOk,
  statusError,
  latencyLabel,
  upstreamLabel,
  tryLabel,
  sandboxLabel,
  postmanLabel,
  postmanHref,
  entries,
}: ApisCatalogTemplateProps) {
  const internal = entries.filter((entry) => entry.kind === "internal");
  const external = entries.filter((entry) => entry.kind === "external");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{title}</h1>
          <Badge variant={allOk ? "default" : "destructive"}>
            {allOk ? statusOk : `${failedCount} ${statusError}`}
          </Badge>
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
        <p className="text-xs text-muted-foreground">
          <time dateTime={checkedAt}>
            {new Date(checkedAt).toLocaleString()}
          </time>
          {" · "}
          {/* API route — no es página del app router */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/status/public-apis"
            className="underline-offset-4 hover:underline"
          >
            JSON
          </a>
          {" · "}
          <a
            href={postmanHref}
            className="underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {postmanLabel}
          </a>
        </p>
      </header>

      <ApiSection
        heading={internalSection}
        entries={internal}
        statusOk={statusOk}
        statusError={statusError}
        latencyLabel={latencyLabel}
        upstreamLabel={upstreamLabel}
        tryLabel={tryLabel}
        sandboxLabel={sandboxLabel}
      />

      <ApiSection
        heading={externalSection}
        entries={external}
        statusOk={statusOk}
        statusError={statusError}
        latencyLabel={latencyLabel}
        upstreamLabel={upstreamLabel}
        tryLabel={tryLabel}
        sandboxLabel={sandboxLabel}
      />
    </main>
  );
}
