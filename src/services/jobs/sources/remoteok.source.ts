import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";
import { matchesJobIngestQuery } from "@/domain/jobs/job-filters";
import { REMOTIVE_TITLE_EXCLUDE } from "../job-ingest.config";

const API_URL = "https://remoteok.com/api";
const USER_AGENT = "adolfo-jobs-ingest (+https://github.com/erickorso/adolfo)";

type RemoteOkJob = {
  id?: string;
  slug?: string;
  position?: string;
  company?: string;
  date?: string;
  url?: string;
  description?: string;
  tags?: string[];
};

/**
 * Fuente RemoteOK (API pública). Requiere User-Agent y atribución a remoteok.com.
 * GET https://remoteok.com/api
 */
export class RemoteOkSource implements JobSource {
  readonly name = "remoteok";

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
        next: { revalidate: 0 },
      });
      if (!res.ok) {
        console.error(`RemoteOK API respondió ${res.status}`);
        return [];
      }
      const data = (await res.json()) as RemoteOkJob[];
      return data
        .filter((job) => Boolean(job.position?.trim() && job.id))
        .map((job) => this.normalize(job))
        .filter((job) => this.matchesProfile(job))
        .filter((job) => matchesJobIngestQuery(job, query));
    } catch (error) {
      console.error("Error consultando RemoteOK:", error);
      return [];
    }
  }

  private normalize(job: RemoteOkJob): NormalizedJob {
    const title = job.position!.trim();
    const slug = job.slug?.trim();
    const url =
      job.url?.trim() ||
      (slug ? `https://remoteok.com/remote-jobs/${slug}` : `https://remoteok.com/`);

    return {
      source: this.name,
      externalId: String(job.id),
      company: job.company?.trim() || "Unknown",
      title,
      location: "Remote",
      remote: true,
      url,
      description: job.description?.trim() || null,
      postedAt: job.date ? new Date(job.date) : null,
    };
  }

  private matchesProfile(job: NormalizedJob): boolean {
    return !REMOTIVE_TITLE_EXCLUDE.test(job.title);
  }
}
