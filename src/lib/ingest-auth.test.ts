import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    JOBS_INGEST_SECRET: "jobs-secret",
    CRON_SECRET: "cron-secret",
  },
}));

import { isIngestAuthorized } from "./ingest-auth";

describe("isIngestAuthorized", () => {
  it("acepta JOBS_INGEST_SECRET", () => {
    const request = new Request("http://localhost/api/jobs/ingest", {
      headers: { authorization: "Bearer jobs-secret" },
    });
    expect(isIngestAuthorized(request)).toBe(true);
  });

  it("acepta CRON_SECRET", () => {
    const request = new Request("http://localhost/api/rates/ingest", {
      headers: { authorization: "Bearer cron-secret" },
    });
    expect(isIngestAuthorized(request)).toBe(true);
  });

  it("rechaza token inválido", () => {
    const request = new Request("http://localhost/api/jobs/ingest", {
      headers: { authorization: "Bearer wrong" },
    });
    expect(isIngestAuthorized(request)).toBe(false);
  });
});
