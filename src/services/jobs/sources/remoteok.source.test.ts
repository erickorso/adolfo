import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mocks/server";
import { RemoteOkSource } from "./remoteok.source";

const REMOTEOK_URL = "https://remoteok.com/api";

function mockRemoteOk() {
  server.use(
    http.get(REMOTEOK_URL, () =>
      HttpResponse.json([
        { legal: "terms" },
        {
          id: "9001",
          slug: "remote-senior-react-dev-acme-9001",
          position: "Senior React Developer",
          company: "Acme Corp",
          date: "2026-07-10T12:00:00+00:00",
          url: "https://remoteok.com/remote-jobs/9001",
          description: "React + TypeScript",
        },
        {
          id: "9002",
          slug: "remote-sales-rep-9002",
          position: "Sales Representative",
          company: "Other Co",
          date: "2026-07-09T12:00:00+00:00",
        },
      ]),
    ),
  );
}

describe("RemoteOkSource", () => {
  it("trae y normaliza vacantes filtradas por perfil", async () => {
    mockRemoteOk();
    const jobs = await new RemoteOkSource().fetchJobs({});
    expect(jobs).toHaveLength(1);
    expect(jobs[0]).toMatchObject({
      source: "remoteok",
      externalId: "9001",
      company: "Acme Corp",
      title: "Senior React Developer",
      remote: true,
    });
  });

  it("devuelve vacío si la API falla", async () => {
    server.use(
      http.get(REMOTEOK_URL, () => new HttpResponse(null, { status: 503 })),
    );
    const jobs = await new RemoteOkSource().fetchJobs({});
    expect(jobs).toEqual([]);
  });
});
