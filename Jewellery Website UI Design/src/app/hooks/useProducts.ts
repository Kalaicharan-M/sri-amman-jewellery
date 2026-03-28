import { useEffect, useState } from "react";

import { fetchProducts, type Product } from "../lib/productsApi";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProducts(signal?: AbortSignal) {
    try {
      setLoading(true);
      setError(null);
      const nextProducts = await fetchProducts(signal);
      setProducts(nextProducts);
    } catch (loadError) {
      if (signal?.aborted) {
        return;
      }

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load jewellery products right now.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(controller.signal);

    return () => controller.abort();
  }, []);

  return {
    products,
    loading,
    error,
    reload: async () => loadProducts(),
  };
}
