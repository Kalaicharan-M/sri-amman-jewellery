import { buildApiUrl, fetchWithRetry } from "./api";

export interface RateCardMeta {
  generated_at: string;
  data_date?: string;
  gold_22k?: number;
  silver?: number;
}

export async function fetchRateCardMeta(signal?: AbortSignal): Promise<RateCardMeta> {
  const response = await fetchWithRetry(buildApiUrl("/gold-rate/card/meta"), {
    signal,
    retries: 2,
    retryDelayMs: 1500,
  });

  if (!response.ok) {
    throw new Error("Unable to load today's rate card right now.");
  }

  return response.json();
}

export function buildRateCardImageUrl(meta: RateCardMeta) {
  return `${buildApiUrl("/gold-rate/card")}?v=${encodeURIComponent(meta.generated_at)}`;
}
