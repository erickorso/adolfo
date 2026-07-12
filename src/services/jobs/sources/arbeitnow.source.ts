import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";
import { matchesJobIngestQuery } from "@/domain/jobs/job-filters";
import { REMOTIVE_TITLE_EXCLUDE } from "../job-ingest.config";

const API_URL = "https://arbeitnow.com/api/job-board-api";

type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description?: string;
  remote: boolean;
  url: string;
  location?: string;
  tags?: string[];
  created_at?: number;
};

type ArbeitnowResponse = {
  data?: ArbeitnowJob[];
};

/**
 * Fuente Arbeitnow (API pública, foco EU). Ideal para remoto desde España.
 * GET https://arbeitnow.com/api/job-board-api
 */
export class ArbeitnowSource implements JobSource {
  readonly name = "arbeitnow";

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "adolfo-jobs-ingest",
        },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error(`Arbeitnow API respondió ${res.status}`);
        return [];
      }
      const payload = (await res.json()) as ArbeitnowResponse;
      return (payload.data ?? [])
        .map((job) => this.normalize(job))
        .filter((job) => this.matchesProfile(job))
        .filter((job) => matchesJobIngestQuery(job, query));
    } catch (error) {
      console.error("Error consultando Arbeitnow:", error);
      return [];
    }
  }

  private normalize(job: ArbeitnowJob): NormalizedJob {
    return {
      source: this.name,
      externalId: job.slug,
      company: job.company_name.trim(),
      title: job.title.trim(),
      location: job.location?.trim() || (job.remote ? "Remote" : null),
      remote: job.remote,
      url: job.url,
      description: stripHtml(job.description),
      postedAt:
        typeof job.created_at === "number"
          ? new Date(job.created_at * 1000)
          : null,
    };
  }

  private matchesProfile(job: NormalizedJob): boolean {
    return !REMOTIVE_TITLE_EXCLUDE.test(job.title);
  }
}

function stripHtml(html: string | undefined): string | null {
  if (!html?.trim()) {
    return null;
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
