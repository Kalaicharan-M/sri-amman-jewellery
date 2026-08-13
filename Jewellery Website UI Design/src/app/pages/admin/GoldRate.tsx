import { Navigate } from "react-router";
import { AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

import { useGoldRates } from "../../hooks/useGoldRates";
import { getAdminSession } from "../../lib/adminSession";
import { formatLastUpdated, formatRate } from "../../lib/goldRateDisplay";

export function AdminGoldRate() {
  const session = getAdminSession();
  const { displayData, loading, error, isUsingFallback } = useGoldRates();
  const refreshIntervalMinutes = displayData.cache_ttl_minutes ?? 5;
  const history = displayData.history ?? [];

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
            Gold Rate Monitor
          </p>
          <h1 className="mt-2 text-3xl text-slate-900 sm:text-4xl">
            Live pricing status for the storefront.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Review the live rate feed, confirm fallback behavior, and check recent
            price history served by the Flask scraper endpoint.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "22K Gold", value: displayData.gold_22k },
            { label: "24K Gold", value: displayData.gold_24k },
            { label: "Silver", value: displayData.silver },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[1.75rem] border border-[#eadfc5] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-3xl text-slate-900">
                {loading ? "Loading..." : `Rs. ${formatRate(item.value)}`}
              </p>
              <p className="mt-2 text-sm text-slate-600">per gram</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff3d1] text-[#b88a2f]">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl text-slate-900">Sync Status</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The backend checks the source every {refreshIntervalMinutes} minutes.
                  Cached values are served if the external source is unavailable. The
                  rate itself only changes when the source republishes it, so the same
                  value may persist for hours between the source's own updates.
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {loading
                    ? "Checking the latest sync..."
                    : `Rate last changed: ${formatLastUpdated(displayData.last_updated)}`}
                </p>
                {!loading && displayData.cache_last_updated && (
                  <p className="mt-1 text-xs text-slate-400">
                    System last checked: {formatLastUpdated(displayData.cache_last_updated)}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!error && isUsingFallback && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                A cached fallback response is active right now. The customer-facing page
                is protected from blank states even when the source site is unavailable.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <h2 className="text-2xl text-slate-900">Operational Notes</h2>
            <div className="mt-5 space-y-3">
              {[
                "The public gold-rate page consumes the same backend endpoint.",
                "CORS is enabled for localhost and Vercel deployments.",
                "A failed scrape falls back to cached data instead of breaking the UI.",
                "Product pricing in the catalogue remains independent from metal-rate snapshots.",
                "The rate card image regenerates automatically whenever the rate changes.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] p-4 text-sm leading-6 text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl text-slate-900">Recent Price History</h2>
              <p className="mt-2 text-sm text-slate-600">
                Snapshot of the latest rate history returned by the scraper endpoint.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3d1] px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
              <ShieldCheck className="h-4 w-4" />
              Live backend feed
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#eadfc5] text-left text-sm text-slate-500">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">22K</th>
                  <th className="px-4 py-3 text-right">24K</th>
                  <th className="px-4 py-3 text-right">Silver</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, index) => (
                  <tr
                    key={`${row.date}-${index}`}
                    className="border-b border-[#f5eee2] text-sm text-slate-700"
                  >
                    <td className="px-4 py-4">{row.date}</td>
                    <td className="px-4 py-4 text-right">Rs. {formatRate(row.gold_22k)}</td>
                    <td className="px-4 py-4 text-right">Rs. {formatRate(row.gold_24k)}</td>
                    <td className="px-4 py-4 text-right">Rs. {formatRate(row.silver)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {history.length === 0 && !loading && (
            <div className="mt-4 rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] px-5 py-12 text-center text-sm text-slate-600">
              No history records are available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
