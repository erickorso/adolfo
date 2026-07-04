import { StreamingMetricsSandboxClient } from "@/components/templates/streaming-metrics-sandbox-client";

export default function StreamingMetricsSandboxPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">Simulacro A · Mediastream prep</p>
        <h1 className="text-3xl font-bold">Streaming metrics</h1>
        <p className="text-muted-foreground">
          Top content by plays — API + dashboard. Cronómetro: 60 min.
        </p>
      </header>
      <StreamingMetricsSandboxClient />
    </main>
  );
}
