import { fetchPublicJson } from "@/services/demo/public-api-fetch";

const HNRSS_URL = "https://hnrss.org/jobs.jsonfeed";
const FIREBASE_JOB_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/jobstories.json";

const PROBE_TIMEOUT_MS = 5_000;

async function probeHnrssFeed(): Promise<{ count: number; source: string }> {
  const data = await fetchPublicJson<{ items?: unknown[] }>(HNRSS_URL, {
    timeoutMs: PROBE_TIMEOUT_MS,
  });
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Empty HN jobs feed (hnrss)");
  }
  return { count: data.items.length, source: "hnrss.org" };
}

async function probeFirebaseJobStories(): Promise<{ count: number; source: string }> {
  const ids = await fetchPublicJson<number[]>(FIREBASE_JOB_STORIES_URL, {
    timeoutMs: PROBE_TIMEOUT_MS,
  });
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Empty HN jobstories (firebase)");
  }
  return { count: ids.length, source: "firebaseio.com" };
}

/**
 * Health check HN jobs: hnrss (ingesta) o API oficial Firebase si hnrss es lento.
 * En paralelo para no bloquear la página >5s.
 */
export async function probeHackerNewsJobsAvailability(): Promise<{
  count: number;
  source: string;
}> {
  const results = await Promise.allSettled([
    probeHnrssFeed(),
    probeFirebaseJobStories(),
  ]);

  const ok = results.find(
    (result): result is PromiseFulfilledResult<{ count: number; source: string }> =>
      result.status === "fulfilled",
  );

  if (ok) {
    return ok.value;
  }

  const reason = results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) =>
      result.reason instanceof Error ? result.reason.message : "unknown",
    )
    .join("; ");

  throw new Error(reason || "HN jobs unavailable");
}
