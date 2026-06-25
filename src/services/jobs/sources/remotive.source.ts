import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";
import { REMOTIVE_TITLE_EXCLUDE } from "../job-ingest.config";

const API_URL = "https://remotive.com/api/remote-jobs";

type RemotiveJob = {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string | null;
  job_type: string | null;
  url: string;
  publication_date: string | null;
  description: string | null;
  tags?: string[];
};

type RemotiveResponse = {
  jobs?: RemotiveJob[];
};

/**
 * Fuente Remotive (API pública, sin auth).
 * GET https://remotive.com/api/remote-jobs
 */
export class RemotiveSource implements JobSource {
  readonly name = "remotive";

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    try {
      const res = await fetch(API_URL, {
        headers: { Accept: "application/json" },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error(`Remotive API respondió ${res.status}`);
        return [];
      }
      const data = (await res.json()) as RemotiveResponse;
      return (data.jobs ?? [])
        .map((job) => this.normalize(job))
        .filter((job) => this.matchesProfile(job))
        .filter((job) => this.matchesQuery(job, query));
    } catch (error) {
      console.error("Error consultando Remotive:", error);
      return [];
    }
  }

  private normalize(job: RemotiveJob): NormalizedJob {
    const location = job.candidate_required_location?.trim() || "Remote";
    return {
      source: this.name,
      externalId: String(job.id),
      company: job.company_name.trim(),
      title: job.title.trim(),
      location,
      remote: true,
      url: job.url,
      description: job.description?.trim() || null,
      postedAt: job.publication_date ? new Date(job.publication_date) : null,
    };
  }

  private matchesProfile(job: NormalizedJob): boolean {
    const text = job.title;
    return !REMOTIVE_TITLE_EXCLUDE.test(text);
  }

  private matchesQuery(job: NormalizedJob, query: JobQuery): boolean {
    if (query.remoteOnly && !job.remote) {
      return false;
    }
    if (query.keywords && query.keywords.length > 0) {
      const haystack = job.title.toLowerCase();
      return query.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
    }
    return true;
  }
}
