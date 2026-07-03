import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";

const JOBS_FEED_URL = "https://hnrss.org/jobs.jsonfeed";

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
    try {
      const res = await fetch(JOBS_FEED_URL, {
        headers: { Accept: "application/feed+json" },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error(`HN jobs feed respondió ${res.status}`);
        return [];
      }
      const data = (await res.json()) as JsonFeedResponse;
      return (data.items ?? [])
        .map((item) => this.normalize(item))
        .filter((job): job is NormalizedJob => job !== null)
        .filter((job) => this.matchesQuery(job, query));
    } catch (error) {
      console.error("Error consultando HN jobs feed:", error);
      return [];
    }
  }

  private normalize(item: JsonFeedItem): NormalizedJob | null {
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

  private matchesQuery(job: NormalizedJob, query: JobQuery): boolean {
    if (query.remoteOnly && !job.remote) {
      return false;
    }
    if (query.keywords && query.keywords.length > 0) {
      const haystack = `${job.title} ${job.company}`.toLowerCase();
      return query.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
    }
    return true;
  }
}
