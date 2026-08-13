import { useEffect, useState } from "react";

import { fetchRateCardMeta, type RateCardMeta } from "../lib/rateCardApi";

const POLL_INTERVAL_MS = 60_000;

export function useRateCard() {
  const [meta, setMeta] = useState<RateCardMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isFirstLoad = true;

    async function loadMeta() {
      try {
        if (isFirstLoad) {
          setLoading(true);
        }
        const response = await fetchRateCardMeta(controller.signal);
        setMeta(response);
        setError(null);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load today's rate card right now.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          isFirstLoad = false;
        }
      }
    }

    void loadMeta();
    const intervalId = window.setInterval(() => void loadMeta(), POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return { meta, loading, error };
}
