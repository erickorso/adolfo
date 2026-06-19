import { describe, expect, it } from "vitest";
import { dedupeJobs, jobToVM, normalizedToData } from "./job.mapper";
import type { NormalizedJob } from "@/domain/jobs/job.types";
import type { JobPosting } from "@/generated/prisma/client";

const normalized: NormalizedJob = {
  source: "greenhouse",
  externalId: "1",
  company: "acme",
  title: "Frontend Engineer",
  location: "Remote",
  remote: true,
  url: "https://jobs.example/1",
  description: "<p>desc</p>",
  postedAt: new Date("2026-01-01T00:00:00Z"),
};

describe("job.mapper", () => {
  it("dedupeJobs elimina duplicados por source+externalId", () => {
    const result = dedupeJobs([normalized, { ...normalized }, { ...normalized, externalId: "2" }]);
    expect(result).toHaveLength(2);
  });

  it("normalizedToData expone solo campos persistibles", () => {
    const data = normalizedToData(normalized);
    expect(data).not.toHaveProperty("fetchedAt");
    expect(data.source).toBe("greenhouse");
    expect(data.remote).toBe(true);
  });

  it("jobToVM proyecta la vacante de DB al view model", () => {
    const dbJob: JobPosting = {
      id: "job_1",
      source: "greenhouse",
      externalId: "1",
      company: "acme",
      title: "Frontend Engineer",
      location: "Remote",
      remote: true,
      url: "https://jobs.example/1",
      description: "<p>desc</p>",
      postedAt: new Date("2026-01-01T00:00:00Z"),
      fetchedAt: new Date("2026-01-03T00:00:00Z"),
      createdAt: new Date("2026-01-03T00:00:00Z"),
      updatedAt: new Date("2026-01-03T00:00:00Z"),
    };
    const vm = jobToVM(dbJob);
    expect(vm).toEqual({
      id: "job_1",
      source: "greenhouse",
      company: "acme",
      title: "Frontend Engineer",
      location: "Remote",
      remote: true,
      url: "https://jobs.example/1",
      postedAt: dbJob.postedAt,
    });
    // El VM no filtra description al cliente.
    expect(vm).not.toHaveProperty("description");
  });
});
