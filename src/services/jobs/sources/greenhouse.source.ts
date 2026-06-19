import type { JobQuery, JobSource, NormalizedJob } from "@/domain/jobs/job.types";

/**
 * Forma (parcial) de la respuesta del Job Board API de Greenhouse.
 * GET https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=true
 */
type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  updated_at: string;
  location: { name: string } | null;
  content?: string;
};

type GreenhouseResponse = {
  jobs: GreenhouseJob[];
};

const BASE_URL = "https://boards-api.greenhouse.io/v1/boards";

/**
 * Fuente de empleos basada en el API público de Greenhouse (ATS).
 * Cada empresa expone su "board" por un token. Se construye con la lista de
 * boards a observar. Adapter puro: solo hace HTTP + normaliza (sin DB).
 */
export class GreenhouseSource implements JobSource {
  readonly name = "greenhouse";

  constructor(private readonly boardTokens: string[]) {}

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    const perBoard = await Promise.all(
      this.boardTokens.map((board) => this.fetchBoard(board)),
    );
    const all = perBoard.flat();
    return all.filter((job) => this.matchesQuery(job, query));
  }

  /** Trae y normaliza un board; si falla, no tumba al resto. */
  private async fetchBoard(board: string): Promise<NormalizedJob[]> {
    try {
      const res = await fetch(`${BASE_URL}/${board}/jobs?content=true`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        console.error(`Greenhouse board "${board}" respondió ${res.status}`);
        return [];
      }
      const data = (await res.json()) as GreenhouseResponse;
      return data.jobs.map((job) => this.normalize(board, job));
    } catch (error) {
      console.error(`Error consultando el board "${board}":`, error);
      return [];
    }
  }

  private normalize(board: string, job: GreenhouseJob): NormalizedJob {
    const location = job.location?.name?.trim() || null;
    return {
      source: this.name,
      externalId: String(job.id),
      company: board,
      title: job.title,
      location,
      remote: location ? /remote|remoto/i.test(location) : false,
      url: job.absolute_url,
      description: job.content ?? null,
      postedAt: job.updated_at ? new Date(job.updated_at) : null,
    };
  }

  private matchesQuery(job: NormalizedJob, query: JobQuery): boolean {
    if (query.remoteOnly && !job.remote) {
      return false;
    }
    if (query.keywords && query.keywords.length > 0) {
      const title = job.title.toLowerCase();
      return query.keywords.some((kw) => title.includes(kw.toLowerCase()));
    }
    return true;
  }
}
