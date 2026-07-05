import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PlaybackEvent } from "../domain/streaming-metrics/types.js";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = path.resolve(backendRoot, "..");

/** Dataset compartido con Next.js: src/data/streaming/playback-events.json */
const DATA_PATH = path.join(repoRoot, "src/data/streaming/playback-events.json");

let cached: PlaybackEvent[] | null = null;

export function loadPlaybackEvents(): PlaybackEvent[] {
  if (cached) {
    return cached;
  }

  const raw = readFileSync(DATA_PATH, "utf8");
  cached = JSON.parse(raw) as PlaybackEvent[];
  return cached;
}
