import { useState } from "react";
import {
  AlertCircle,
  Download,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { useGoldRates } from "../hooks/useGoldRates";
import { useRateCard } from "../hooks/useRateCard";
import {
  type GoldRateChange,
  type GoldRateHistoryRow,
} from "../lib/goldRateApi";
import {
  FALLBACK_GOLD_RATE_RESPONSE,
  formatHistoryDate,
  formatLastUpdated,
  formatRate,
} from "../lib/goldRateDisplay";
import { buildRateCardImageUrl, downloadRateCardImage } from "../lib/rateCardApi";

function ChangeSummary({ change }: { change?: GoldRateChange | null }) {
  if (!change) {
    return <span className="text-sm text-gray-500">Daily change unavailable</span>;
  }

  const isPositive = change.change >= 0;
  const trendClassName = isPositive ? "text-green-600" : "text-red-600";

  return (
    <div className={`flex items-center gap-2 text-sm ${trendClassName}`}>
      {isPositive ? (
        <TrendingUp className="w-4 h-4 flex-shrink-0" />
      ) : (
        <TrendingDown className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="inline-flex flex-wrap items-center gap-1">
        {isPositive ? "+" : ""}
        {formatRate(change.change)} ({change.change_percent}%)
        <span className="text-gray-500">from previous update</span>
      </span>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-40 bg-gray-200 rounded"></div>
    </div>
  );
}

function HistoryTable({
  history,
  isFallback,
}: {
  history: GoldRateHistoryRow[];
  isFallback: boolean;
}) {
  return (
    <tbody className="divide-y divide-gray-200">
      {history.map((row, index) => (
        <tr
          key={`${row.date}-${index}`}
          className={index === 0 ? "bg-yellow-50" : "hover:bg-gray-50"}
        >
          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-900">
            {formatHistoryDate(row.date)}
            {index === 0 && (
              <span className="ml-2 text-xs text-yellow-600">
                {isFallback ? "(Fallback)" : "(Latest)"}
              </span>
            )}
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-right text-gray-900">
            Rs. {formatRate(row.gold_22k)}
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-right text-gray-900">
            Rs. {formatRate(row.gold_24k)}
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-right text-gray-900">
            Rs. {formatRate(row.silver)}
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function LoadingHistory() {
  return (
    <tbody className="divide-y divide-gray-200">
      {Array.from({ length: 4 }).map((_, index) => (
        <tr key={index}>
          <td className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="ml-auto h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="ml-auto h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </td>
          <td className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="ml-auto h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export function GoldRate() {
  const { goldRates, displayData, loading, error } = useGoldRates();
  const { meta: rateCardMeta, loading: rateCardLoading, error: rateCardError } = useRateCard();
  const history = displayData.history ?? FALLBACK_GOLD_RATE_RESPONSE.history ?? [];
  const isUsingFallback = !goldRates;
  const refreshIntervalMinutes = displayData.cache_ttl_minutes ?? 5;
  const cachedStatusMessage =
    displayData.source_status === "stale_cache"
      ? displayData.warning || "Showing the latest cached rates."
      : null;
  const rateCardImageUrl = rateCardMeta ? buildRateCardImageUrl(rateCardMeta) : null;
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!rateCardMeta) {
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);
      await downloadRateCardImage(rateCardMeta);
    } catch (error) {
      setDownloadError(
        error instanceof Error ? error.message : "Unable to download the rate card image.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 sm:py-16 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4">
            Today&apos;s Gold and Silver Rates
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-3">
            Live precious metal rates for your jewellery shoppers
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">
              Data is served by the Flask backend and refreshed every {refreshIntervalMinutes} minutes
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {loading
              ? "Fetching the latest live rates..."
              : `Rate last changed: ${formatLastUpdated(displayData.last_updated)}`}
          </p>
          {!loading && displayData.cache_last_updated && (
            <p className="text-xs text-gray-400 mt-1">
              System last checked: {formatLastUpdated(displayData.cache_last_updated)}
            </p>
          )}
        </div>

        <div className="mb-6 sm:mb-8 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-gray-900">Today&apos;s Rate Card</h2>
              <p className="text-sm text-gray-600 mt-1">
                Shareable rate card image, refreshed automatically whenever the rate changes.
              </p>
            </div>
            {rateCardImageUrl && (
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm text-sm disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading..." : "Download Image"}
              </button>
            )}
          </div>

          <div className="mt-4">
            {rateCardLoading && (
              <div className="aspect-[1280/908] w-full max-w-xl bg-gray-200 rounded-lg animate-pulse"></div>
            )}

            {!rateCardLoading && rateCardError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{rateCardError}</p>
              </div>
            )}

            {downloadError && (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{downloadError}</p>
              </div>
            )}

            {!rateCardLoading && rateCardImageUrl && (
              <img
                src={rateCardImageUrl}
                alt="Today's gold and silver rate card"
                className="w-full max-w-xl rounded-lg border border-gray-200 shadow-sm"
              />
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Live rates are temporarily unavailable.</p>
              <p className="text-sm">
                {error} Showing fallback jewellery rates until the backend recovers.
              </p>
            </div>
          </div>
        )}

        {cachedStatusMessage && !error && (
          <div className="mb-6 sm:mb-8 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-amber-800">
            <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Cached rates in use</p>
              <p className="text-sm">{cachedStatusMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 sm:mb-12">
          {loading ? (
            <>
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">22K Gold</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        Rs. {formatRate(displayData.gold_22k)}
                      </span>
                      <span className="text-sm text-gray-600">/gram</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-yellow-700">
                    22K
                  </div>
                </div>
                <ChangeSummary change={displayData.changes?.gold_22k} />
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">24K Gold</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        Rs. {formatRate(displayData.gold_24k)}
                      </span>
                      <span className="text-sm text-gray-600">/gram</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-yellow-700">
                    24K
                  </div>
                </div>
                <ChangeSummary change={displayData.changes?.gold_24k} />
              </div>

              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Silver</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                        Rs. {formatRate(displayData.silver)}
                      </span>
                      <span className="text-sm text-gray-600">/gram</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold text-gray-700">
                    Ag
                  </div>
                </div>
                <ChangeSummary change={displayData.changes?.silver} />
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Price History</h2>
            <p className="text-sm text-gray-600 mt-1">
              Recent precious metal updates from the backend scraper
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">
                    Date
                  </th>
                  <th className="text-right px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">
                    22K Gold (Rs./gram)
                  </th>
                  <th className="text-right px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">
                    24K Gold (Rs./gram)
                  </th>
                  <th className="text-right px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-700">
                    Silver (Rs./gram)
                  </th>
                </tr>
              </thead>
              {loading ? (
                <LoadingHistory />
              ) : (
                <HistoryTable history={history} isFallback={isUsingFallback} />
              )}
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-5 sm:p-6 border border-yellow-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">About Gold Purity</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">22K Gold:</strong> Contains 91.67%
                pure gold, making it ideal for jewellery that needs durability.
              </p>
              <p>
                <strong className="text-gray-900">24K Gold:</strong> Offers the
                highest purity at 99.9%, which makes it softer and more valuable.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-5 sm:p-6 border border-blue-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">Rate Information</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>- Live scraping is automatically refreshed every {refreshIntervalMinutes} minutes.</p>
              <p>- Cached data is served if the source website is temporarily down.</p>
              <p>- Jewellery making charges are separate and vary by design.</p>
              <p>- Contact the store for custom quotes and bulk purchase support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
