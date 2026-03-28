const PRODUCTION_API_BASE_URL = "https://sri-amman-jewellery-vj63.onrender.com";

const DEFAULT_API_BASE_URL = import.meta.env.PROD
  ? PRODUCTION_API_BASE_URL
  : "http://localhost:5000";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_GOLD_RATE_API_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, "");

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

interface RetryFetchOptions extends RequestInit {
  retries?: number;
  retryDelayMs?: number;
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

async function waitForRetry(delayMs: number, signal?: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup();
      resolve();
    }, delayMs);

    function cleanup() {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", handleAbort);
    }

    function handleAbort() {
      cleanup();
      reject(new DOMException("The operation was aborted.", "AbortError"));
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  options: RetryFetchOptions = {},
) {
  const {
    retries = 2,
    retryDelayMs = 1200,
    signal,
    ...requestInit
  } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(input, {
        ...requestInit,
        signal,
      });

      if (
        response.ok ||
        !RETRYABLE_STATUS_CODES.has(response.status) ||
        attempt === retries
      ) {
        return response;
      }
    } catch (error) {
      if (isAbortError(error) || attempt === retries) {
        throw error;
      }
    }

    await waitForRetry(retryDelayMs * (attempt + 1), signal);
  }

  throw new Error("Unable to complete the request.");
}

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function resolveAssetUrl(path?: string) {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  return buildApiUrl(path);
}
