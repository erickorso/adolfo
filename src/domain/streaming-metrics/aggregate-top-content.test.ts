import { describe, expect, it } from "vitest";
import { aggregateTopContent, countTotalPlays } from "./aggregate-top-content";
import type { PlaybackEvent } from "./types";

const FIXTURE: PlaybackEvent[] = [
  {
    userId: "u1",
    contentId: "alpha",
    timestamp: "2026-06-10T12:00:00Z",
    durationSec: 100,
    country: "ES",
  },
  {
    userId: "u2",
    contentId: "alpha",
    timestamp: "2026-06-11T12:00:00Z",
    durationSec: 200,
    country: "ES",
  },
  {
    userId: "u3",
    contentId: "beta",
    timestamp: "2026-06-11T13:00:00Z",
    durationSec: 300,
    country: "MX",
  },
  {
    userId: "u4",
    contentId: "alpha",
    timestamp: "2026-07-01T12:00:00Z",
    durationSec: 50,
    country: "ES",
  },
];

describe("aggregateTopContent", () => {
  it("agrupa y ordena por plays desc", () => {
    const result = aggregateTopContent(FIXTURE, {
      from: new Date("2026-06-01"),
      to: new Date("2026-06-30"),
      limit: 10,
      page: 1,
    });

    expect(result.total).toBe(2);
    expect(result.rows[0]).toEqual({
      contentId: "alpha",
      plays: 2,
      totalDurationSec: 300,
    });
    expect(result.rows[1]?.contentId).toBe("beta");
  });

  it("filtra por country", () => {
    const result = aggregateTopContent(FIXTURE, {
      from: new Date("2026-06-01"),
      to: new Date("2026-06-30"),
      country: "MX",
      limit: 10,
      page: 1,
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.contentId).toBe("beta");
  });

  it("pagina resultados", () => {
    const result = aggregateTopContent(FIXTURE, {
      from: new Date("2026-06-01"),
      to: new Date("2026-06-30"),
      limit: 1,
      page: 2,
    });

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.contentId).toBe("beta");
  });
});

describe("countTotalPlays", () => {
  it("cuenta eventos en rango", () => {
    expect(
      countTotalPlays(FIXTURE, {
        from: new Date("2026-06-01"),
        to: new Date("2026-06-30"),
        limit: 10,
        page: 1,
      }),
    ).toBe(3);
  });
});
