import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { GreenhouseSource } from "./greenhouse.source";

const BOARD_URL = "https://boards-api.greenhouse.io/v1/boards/:board/jobs";

function mockBoard() {
  server.use(
    http.get(BOARD_URL, () =>
      HttpResponse.json({
        jobs: [
          {
            id: 1,
            title: "Senior Frontend Engineer",
            absolute_url: "https://jobs.example/1",
            updated_at: "2026-01-01T00:00:00Z",
            location: { name: "Remote - LATAM" },
          },
          {
            id: 2,
            title: "Backend Developer",
            absolute_url: "https://jobs.example/2",
            updated_at: "2026-01-02T00:00:00Z",
            location: { name: "Buenos Aires" },
          },
        ],
      }),
    ),
  );
}

describe("GreenhouseSource", () => {
  it("trae y normaliza las vacantes del board", async () => {
    mockBoard();
    const jobs = await new GreenhouseSource(["acme"]).fetchJobs({});
    expect(jobs).toHaveLength(2);
    expect(jobs[0]).toMatchObject({
      source: "greenhouse",
      externalId: "1",
      company: "acme",
      title: "Senior Frontend Engineer",
      remote: true,
    });
    expect(jobs[0].postedAt).toBeInstanceOf(Date);
    expect(jobs[1].remote).toBe(false);
  });

  it("filtra por palabra clave en el título", async () => {
    mockBoard();
    const jobs = await new GreenhouseSource(["acme"]).fetchJobs({
      keywords: ["frontend"],
    });
    expect(jobs).toHaveLength(1);
    expect(jobs[0].title).toContain("Frontend");
  });

  it("filtra por remoto", async () => {
    mockBoard();
    const jobs = await new GreenhouseSource(["acme"]).fetchJobs({
      remoteOnly: true,
    });
    expect(jobs).toHaveLength(1);
    expect(jobs[0].remote).toBe(true);
  });

  it("un board que falla no tumba al resto (devuelve vacío)", async () => {
    server.use(
      http.get(BOARD_URL, () => new HttpResponse(null, { status: 500 })),
    );
    const jobs = await new GreenhouseSource(["acme"]).fetchJobs({});
    expect(jobs).toEqual([]);
  });
});
