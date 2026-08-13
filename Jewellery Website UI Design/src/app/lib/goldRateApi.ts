import { buildApiUrl, fetchWithRetry } from "./api";

export interface GoldRateHistoryRow {
  date: string;
  gold_22k: number;
  gold_24k: number;
  silver: number;
}

export interface GoldRateChange {
  change: number;
  change_percent: number;
}

export interface GoldRateResponse {
  gold_22k: number;
  gold_24k: number;
  silver: number;
  last_updated: string;
  data_date?: string;
  history?: GoldRateHistoryRow[];
  changes?: {
    gold_22k?: GoldRateChange | null;
    gold_24k?: GoldRateChange | null;
    silver?: GoldRateChange | null;
  };
  source_status?: string;
  warning?: string;
  served_from_cache?: boolean;
  cache_ttl_minutes?: number;
  cache_last_updated?: string;
}

export async function fetchGoldRates(
  signal?: AbortSignal,
): Promise<GoldRateResponse> {
  const response = await fetchWithRetry(buildApiUrl("/gold-rate"), {
    signal,
    retries: 2,
    retryDelayMs: 1500,
  });

  if (!response.ok) {
    let errorMessage = "Unable to load live gold rates.";

    try {
      const errorPayload = await response.json();
      if (typeof errorPayload.error === "string" && errorPayload.error) {
        errorMessage = errorPayload.error;
      }
    } catch {
      // Ignore JSON parsing errors and use the default message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
