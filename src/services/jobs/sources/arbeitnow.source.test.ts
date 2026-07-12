import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { ArbeitnowSource } from "./arbeitnow.source";

const ARBEITNOW_URL = "https://arbeitnow.com/api/job-board-api";

function mockArbeitnow() {
  server.use(
    http.get(ARBEITNOW_URL, () =>
      HttpResponse.json({
        data: [
          {
            slug: "senior-frontend-engineer-berlin-100",
            company_name: "Acme GmbH",
            title: "Senior Frontend Engineer (React)",
            description: "<p>TypeScript</p>",
            remote: true,
            url: "https://www.arbeitnow.com/jobs/companies/acme/senior-frontend-100",
            location: "Berlin",
            created_at: 1783848626,
          },
          {
            slug: "onsite-backend-munich-101",
            company_name: "Legacy Co",
            title: "Backend Engineer",
            remote: false,
            url: "https://www.arbeitnow.com/jobs/companies/legacy/backend-101",
            location: "Munich",
            created_at: 1783848626,
          },
        ],
      }),
    ),
  );
}

describe("ArbeitnowSource", () => {
  it("trae vacantes remotas y normaliza fechas", async () => {
    mockArbeitnow();
    const jobs = await new ArbeitnowSource().fetchJobs({ remoteOnly: true });
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      source: "arbeitnow",
      externalId: "senior-frontend-engineer-berlin-100",
      company: "Acme GmbH",
      remote: true,
      location: "Berlin",
    });
    expect(jobs[0].postedAt).toBeInstanceOf(Date);
  });

  it("devuelve vacío si la API falla", async () => {
    server.use(
      http.get(ARBEITNOW_URL, () => new HttpResponse(null, { status: 503 })),
    );
    const jobs = await new ArbeitnowSource().fetchJobs({});
    expect(jobs).toEqual([]);
  });
});
