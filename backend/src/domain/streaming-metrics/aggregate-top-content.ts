/** Espejo de src/domain/streaming-metrics/aggregate-top-content.ts — mantener en sync. */
import type { PlaybackEvent, TopContentQuery, TopContentRow } from "./types.js";

function utcDateKey(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

export function filterPlaybackEvents(
  events: PlaybackEvent[],
  query: Pick<TopContentQuery, "from" | "to" | "country">,
): PlaybackEvent[] {
  const fromKey = utcDateKey(query.from);
  const toKey = utcDateKey(query.to);

  return events.filter((event) => {
    const eventKey = utcDateKey(event.timestamp);
    if (eventKey < fromKey || eventKey > toKey) {
      return false;
    }
    if (query.country && event.country !== query.country) {
      return false;
    }
    return true;
  });
}

function groupByContentId(events: PlaybackEvent[]): TopContentRow[] {
  const grouped = new Map<string, TopContentRow>();

  for (const event of events) {
    const current = grouped.get(event.contentId);
    if (current) {
      current.plays += 1;
      current.totalDurationSec += event.durationSec;
    } else {
      grouped.set(event.contentId, {
        contentId: event.contentId,
        plays: 1,
        totalDurationSec: event.durationSec,
      });
    }
  }

  return [...grouped.values()].sort((a, b) => {
    if (b.plays !== a.plays) {
      return b.plays - a.plays;
    }
    return a.contentId.localeCompare(b.contentId);
  });
}

export function aggregateTopContent(
  events: PlaybackEvent[],
  query: TopContentQuery,
): { rows: TopContentRow[]; total: number } {
  const filtered = filterPlaybackEvents(events, query);
  const ranked = groupByContentId(filtered);
  const total = ranked.length;
  const offset = (query.page - 1) * query.limit;
  const rows = ranked.slice(offset, offset + query.limit);

  return { rows, total };
}

export function countTotalPlays(
  events: PlaybackEvent[],
  query: TopContentQuery,
): number {
  return filterPlaybackEvents(events, query).length;
}
