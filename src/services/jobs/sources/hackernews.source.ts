import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";
import { matchesJobIngestQuery } from "@/domain/jobs/job-filters";
import { fetchPublicJson } from "@/services/demo/public-api-fetch";

const JOBS_FEED_URL = "https://hnrss.org/jobs.jsonfeed";
const FIREBASE_JOB_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/jobstories.json";
const FIREBASE_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";
const FIREBASE_FALLBACK_LIMIT = 40;

type JsonFeedItem = {
  id?: string;
  title?: string;
  url?: string;
  content_html?: string;
  date_published?: string;
  external_url?: string;
};

type JsonFeedResponse = {
  items?: JsonFeedItem[];
};

type FirebaseItem = {
  id?: number;
  type?: string;
  title?: string;
  url?: string;
  text?: string;
  time?: number;
};

/** Extrae company desde títulos tipo "Acme (YC W24) Is Hiring …". */
export function parseHnJobCompany(title: string): string {
  const hiring = title.match(/^(.+?)\s+(?:\(YC[^)]+\)\s+)?Is Hiring\b/i);
  if (hiring?.[1]) {
    return hiring[1].trim();
  }
  return title.split(/[-–|]/)[0]?.trim() || "Unknown";
}

/** ID estable desde item URL de HN. */
export function parseHnExternalId(item: JsonFeedItem): string | null {
  const fromId = item.id?.match(/id=(\d+)/)?.[1];
  if (fromId) {
    return fromId;
  }
  const fromExternal = item.external_url?.match(/id=(\d+)/)?.[1];
  return fromExternal ?? null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function inferRemote(title: string, description: string | null): boolean {
  const text = `${title} ${description ?? ""}`.toLowerCase();
  return /\bremote\b|\bdistributed\b|\banywhere\b|\bworldwide\b/.test(text);
}

function inferLocation(title: string): string | null {
  const inLoc = title.match(/\bin\s+([A-Z][A-Za-z.\s-]+?)(?:\s|$|,)/);
  if (inLoc?.[1]) {
    return inLoc[1].trim();
  }
  if (inferRemote(title, null)) {
    return "Remote";
  }
  return null;
}

/**
 * Vacantes oficiales de startups YC vía [hnrss.org/jobs](https://hnrss.org/jobs).
 * Sin API key; JSON Feed mantenido por la comunidad.
 */
export class HackerNewsJobsSource implements JobSource {
  readonly name = "hackernews";

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    const feedResult = await this.fetchFromJsonFeed(query);
    if (feedResult.ok) {
      return feedResult.jobs;
    }
    return this.fetchFromFirebase(query);
  }

  private async fetchFromJsonFeed(
    query: JobQuery,
  ): Promise<{ ok: true; jobs: NormalizedJob[] } | { ok: false }> {
    try {
      const res = await fetch(JOBS_FEED_URL, {
        headers: { Accept: "application/feed+json" },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error(`HN jobs feed respondió ${res.status}`);
        return { ok: false };
      }
      const data = (await res.json()) as JsonFeedResponse;
      const jobs = (data.items ?? [])
        .map((item) => this.normalizeFeedItem(item))
        .filter((job): job is NormalizedJob => job !== null)
        .filter((job) => matchesJobIngestQuery(job, query));
      return { ok: true, jobs };
    } catch (error) {
      console.error("Error consultando HN jobs feed:", error);
      return { ok: false };
    }
  }

  /** Fallback: API oficial Firebase cuando hnrss falla o está caído. */
  private async fetchFromFirebase(query: JobQuery): Promise<NormalizedJob[]> {
    try {
      const ids = await fetchPublicJson<number[]>(FIREBASE_JOB_STORIES_URL, {
        timeoutMs: 8_000,
      });
      const slice = ids.slice(0, FIREBASE_FALLBACK_LIMIT);
      const items = await Promise.all(
        slice.map((id) =>
          fetchPublicJson<FirebaseItem>(`${FIREBASE_ITEM_URL}/${id}.json`, {
            timeoutMs: 8_000,
          }).catch(() => null),
        ),
      );
      return items
        .filter((item): item is FirebaseItem => item?.type === "job" && Boolean(item.title))
        .map((item) => this.normalizeFirebaseItem(item))
        .filter((job): job is NormalizedJob => job !== null)
        .filter((job) => matchesJobIngestQuery(job, query));
    } catch (error) {
      console.error("Error consultando HN Firebase jobs:", error);
      return [];
    }
  }

  private normalizeFeedItem(item: JsonFeedItem): NormalizedJob | null {
    const title = item.title?.trim();
    const url = item.url?.trim();
    const externalId = parseHnExternalId(item);

    if (!title || !url || !externalId) {
      return null;
    }

    const company = parseHnJobCompany(title);
    const description = item.content_html
      ? stripHtml(item.content_html)
      : null;
    const remote = inferRemote(title, description);
    const location = inferLocation(title);

    return {
      source: this.name,
      externalId,
      company,
      title,
      location,
      remote,
      url,
      description,
      postedAt: item.date_published ? new Date(item.date_published) : null,
    };
  }

  private normalizeFirebaseItem(item: FirebaseItem): NormalizedJob | null {
    const title = item.title?.trim();
    const url = item.url?.trim() ?? `https://news.ycombinator.com/item?id=${item.id}`;
    if (!title || item.id == null) {
      return null;
    }

    const company = parseHnJobCompany(title);
    const description = item.text?.trim() || null;
    const remote = inferRemote(title, description);

    return {
      source: this.name,
      externalId: String(item.id),
      company,
      title,
      location: inferLocation(title),
      remote,
      url,
      description,
      postedAt: item.time ? new Date(item.time * 1000) : null,
    };
  }
}
