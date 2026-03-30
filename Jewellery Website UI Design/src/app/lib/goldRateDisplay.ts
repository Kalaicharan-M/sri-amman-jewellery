import type { GoldRateResponse } from "./goldRateApi";

export const FALLBACK_GOLD_RATE_RESPONSE: GoldRateResponse = {
  gold_22k: 6450,
  gold_24k: 7020,
  silver: 82,
  last_updated: "2026-03-27T10:00:00+05:30",
  history: [
    { date: "Mar 27, 2026", gold_22k: 6450, gold_24k: 7020, silver: 82 },
    { date: "Mar 26, 2026", gold_22k: 6425, gold_24k: 6990, silver: 83 },
    { date: "Mar 25, 2026", gold_22k: 6410, gold_24k: 6975, silver: 82 },
    { date: "Mar 24, 2026", gold_22k: 6400, gold_24k: 6960, silver: 81 },
    { date: "Mar 23, 2026", gold_22k: 6390, gold_24k: 6950, silver: 80 },
    { date: "Mar 22, 2026", gold_22k: 6380, gold_24k: 6940, silver: 81 },
    { date: "Mar 21, 2026", gold_22k: 6370, gold_24k: 6930, silver: 82 },
  ],
  changes: {
    gold_22k: { change: 25, change_percent: 0.39 },
    gold_24k: { change: 30, change_percent: 0.43 },
    silver: { change: -1, change_percent: -1.2 },
  },
  source_status: "fallback",
  cache_ttl_minutes: 5,
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export function formatRate(value: number) {
  return currencyFormatter.format(value);
}

export function formatLastUpdated(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Last updated time unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(parsed);
}

export function formatHistoryDate(value: string) {
  if (value.includes("/")) {
    const [day, month, year] = value.split("/");
    const parsed = new Date(`${month} ${day}, ${year}`);

    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(parsed);
    }
  }

  return value;
}
