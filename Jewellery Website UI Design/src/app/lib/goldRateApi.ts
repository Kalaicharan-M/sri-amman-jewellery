const DEFAULT_API_BASE_URL = "http://localhost:5000";

const API_BASE_URL = (
  import.meta.env.VITE_GOLD_RATE_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

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
}

export async function fetchGoldRates(
  signal?: AbortSignal,
): Promise<GoldRateResponse> {
  const response = await fetch(`${API_BASE_URL}/gold-rate`, { signal });

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
