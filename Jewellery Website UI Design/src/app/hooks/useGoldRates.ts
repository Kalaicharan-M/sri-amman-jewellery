import { useEffect, useState } from "react";

import { fetchGoldRates, type GoldRateResponse } from "../lib/goldRateApi";
import { FALLBACK_GOLD_RATE_RESPONSE } from "../lib/goldRateDisplay";

export function useGoldRates() {
  const [goldRates, setGoldRates] = useState<GoldRateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGoldRates() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchGoldRates(controller.signal);
        setGoldRates(response);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load live gold rates.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadGoldRates();

    return () => controller.abort();
  }, []);

  return {
    goldRates,
    displayData: goldRates ?? FALLBACK_GOLD_RATE_RESPONSE,
    loading,
    error,
    isUsingFallback: !goldRates,
  };
}
