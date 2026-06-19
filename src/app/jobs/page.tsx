import { JobsTemplate } from "@/components/templates/jobs-template";
import { listJobs } from "@/services/jobs/job.service";

/**
 * Página de empleos. Server Component: lee las vacantes ya ingestadas en la DB
 * (la UI no pega a las fuentes en vivo).
 */
export default async function JobsPage() {
  const jobs = await listJobs();
  return <JobsTemplate jobs={jobs} />;
}
