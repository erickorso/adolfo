import { describe, expect, it } from "vitest";
import {
  aggregateTopContent,
  composeTopContentResponse,
  countTotalPlays,
} from "./aggregate-top-content";
import {
  aggregateTopContent as expressAggregate,
  composeTopContentResponse as expressCompose,
  countTotalPlays as expressCountPlays,
} from "../../../backend/src/domain/streaming-metrics/aggregate-top-content";
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
];

const QUERY = {
  from: new Date("2026-06-01"),
  to: new Date("2026-06-30"),
  limit: 10,
  page: 1,
};

/** Paridad Next vs Express (dominios duplicados, misma salida). */
describe("metrics domain parity (Next vs Express)", () => {
  it("aggregateTopContent produce el mismo resultado", () => {
    const next = aggregateTopContent(FIXTURE, QUERY);
    const express = expressAggregate(FIXTURE, QUERY);
    expect(express).toEqual(next);
  });

  it("countTotalPlays coincide", () => {
    expect(expressCountPlays(FIXTURE, QUERY)).toBe(countTotalPlays(FIXTURE, QUERY));
  });

  it("composeTopContentResponse coincide (sin queryMs)", () => {
    const next = composeTopContentResponse(FIXTURE, QUERY, 42);
    const express = expressCompose(FIXTURE, QUERY, 42);
    expect(express).toEqual(next);
  });
});
