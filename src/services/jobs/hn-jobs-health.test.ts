import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/services/demo/public-api-fetch", () => ({
  fetchPublicJson: vi.fn(),
}));

import { fetchPublicJson } from "@/services/demo/public-api-fetch";
import { probeHackerNewsJobsAvailability } from "./hn-jobs-health";

describe("probeHackerNewsJobsAvailability", () => {
  beforeEach(() => {
    vi.mocked(fetchPublicJson).mockReset();
  });

  it("usa hnrss cuando responde rápido", async () => {
    vi.mocked(fetchPublicJson).mockImplementation(async (url: string) => {
      if (url.includes("hnrss")) {
        return { items: [{ title: "job" }] };
      }
      return [];
    });

    const result = await probeHackerNewsJobsAvailability();
    expect(result).toEqual({ count: 1, source: "hnrss.org" });
  });

  it("cae a firebase si hnrss falla", async () => {
    vi.mocked(fetchPublicJson).mockImplementation(async (url: string) => {
      if (url.includes("hnrss")) {
        throw new Error("timeout");
      }
      return [1, 2, 3];
    });

    const result = await probeHackerNewsJobsAvailability();
    expect(result).toEqual({ count: 3, source: "firebaseio.com" });
  });

  it("falla si ambos upstream fallan", async () => {
    vi.mocked(fetchPublicJson).mockRejectedValue(new Error("down"));

    await expect(probeHackerNewsJobsAvailability()).rejects.toThrow("down");
  });
});
