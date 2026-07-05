/** Espejo de src/domain/streaming-metrics/types.ts — mantener en sync. */
export type PlaybackEvent = {
  userId: string;
  contentId: string;
  timestamp: string;
  durationSec: number;
  country: string;
};

export type TopContentRow = {
  contentId: string;
  plays: number;
  totalDurationSec: number;
};

export type TopContentQuery = {
  from: Date;
  to: Date;
  country?: string;
  limit: number;
  page: number;
};

export type TopContentResponse = {
  rows: TopContentRow[];
  total: number;
  meta: {
    queryMs: number;
    page: number;
    pageSize: number;
    totalPlays: number;
  };
};
