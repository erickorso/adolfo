import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { RemotiveSource } from "./remotive.source";

const REMOTIVE_URL = "https://remotive.com/api/remote-jobs";

function mockRemotive() {
  server.use(
    http.get(REMOTIVE_URL, () =>
      HttpResponse.json({
        jobs: [
          {
            id: 101,
            title: "Senior React Developer",
            company_name: "Acme Corp",
            candidate_required_location: "Worldwide",
            job_type: "full_time",
            url: "https://remotive.com/remote-jobs/react-101",
            publication_date: "2026-06-01T00:00:00Z",
            description: "<p>React + TypeScript</p>",
            tags: ["react", "typescript"],
          },
          {
            id: 102,
            title: "Sales Representative",
            company_name: "Other Co",
            candidate_required_location: "USA",
            job_type: "full_time",
            url: "https://remotive.com/remote-jobs/sales-102",
            publication_date: "2026-06-02T00:00:00Z",
            description: null,
          },
        ],
      }),
    ),
  );
}

describe("RemotiveSource", () => {
  it("trae y normaliza vacantes filtradas por perfil", async () => {
    mockRemotive();
    const jobs = await new RemotiveSource().fetchJobs({});
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      source: "remotive",
      externalId: "101",
      company: "Acme Corp",
      title: "Senior React Developer",
      remote: true,
      url: "https://remotive.com/remote-jobs/react-101",
    });
    expect(jobs[0].postedAt).toBeInstanceOf(Date);
  });

  it("filtra por palabra clave en el título", async () => {
    mockRemotive();
    const jobs = await new RemotiveSource().fetchJobs({ keywords: ["sales"] });
    expect(jobs).toHaveLength(0);
  });

  it("devuelve vacío si la API falla", async () => {
    server.use(
      http.get(REMOTIVE_URL, () => new HttpResponse(null, { status: 503 })),
    );
    const jobs = await new RemotiveSource().fetchJobs({});
    expect(jobs).toEqual([]);
  });
});
