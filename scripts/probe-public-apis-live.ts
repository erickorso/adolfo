/**
 * Smoke HTTP de APIs públicas (servidor en marcha o desplegado).
 * Uso: npx tsx scripts/probe-public-apis-live.ts [baseUrl]
 */
type ProbeReport = {
  allOk: boolean;
  failedCount: number;
  checkedAt: string;
  probes: Array<{ id: string; ok: boolean; latencyMs: number; message: string }>;
};

const baseUrl = (process.argv[2] ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

async function main() {
  console.log(`GET ${baseUrl}/api/status/public-apis\n`);

  const response = await fetch(`${baseUrl}/api/status/public-apis`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const report = (await response.json()) as ProbeReport;

  for (const probe of report.probes ?? []) {
    const icon = probe.ok ? "✓" : "✗";
    console.log(`${icon} ${probe.id} (${probe.latencyMs}ms) — ${probe.message}`);
  }

  console.log(
    `\nHTTP ${response.status} · ${report.allOk ? "All OK" : `${report.failedCount} failed`} @ ${report.checkedAt}`,
  );

  if (!response.ok || !report.allOk) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
