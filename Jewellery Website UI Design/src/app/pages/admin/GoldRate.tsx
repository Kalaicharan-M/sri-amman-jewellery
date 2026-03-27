import { useState } from "react";
import { Save, TrendingUp, Calendar } from "lucide-react";

export function AdminGoldRate() {
  const [rates, setRates] = useState({
    gold22k: "6450",
    gold24k: "7020",
    silver: "82",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRates({
      ...rates,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const history = [
    { date: "Mar 27, 2026", gold22k: 6450, gold24k: 7020, silver: 82 },
    { date: "Mar 26, 2026", gold22k: 6425, gold24k: 6990, silver: 83 },
    { date: "Mar 25, 2026", gold22k: 6410, gold24k: 6975, silver: 82 },
    { date: "Mar 24, 2026", gold22k: 6400, gold24k: 6960, silver: 81 },
    { date: "Mar 23, 2026", gold22k: 6390, gold24k: 6950, silver: 80 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Gold Rate Manual Override</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-gray-600">
              Rates auto-update daily from live data source
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Use this form only to manually override automatic rates when needed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Update Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              {saved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  ✓ Gold rates updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="gold22k" className="block text-gray-900 mb-2">
                    22K Gold Rate (per gram)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="gold22k"
                      name="gold22k"
                      value={rates.gold22k}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="6450"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gold24k" className="block text-gray-900 mb-2">
                    24K Gold Rate (per gram)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="gold24k"
                      name="gold24k"
                      value={rates.gold24k}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="7020"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="silver" className="block text-gray-900 mb-2">
                    Silver Rate (per gram)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      id="silver"
                      name="silver"
                      value={rates.silver}
                      onChange={handleChange}
                      required
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                      placeholder="82"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Override & Publish Rates
                </button>
              </form>

              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  Manual Override Information
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Default: Rates auto-update daily from live data source</li>
                  <li>• Override only when you need custom pricing</li>
                  <li>• Manual updates will replace auto-synced rates</li>
                  <li>• Changes are immediately visible to all customers</li>
                  <li>• Last auto-sync: Today at 10:00 AM</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Current Rates Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Current Rates
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">22K Gold</p>
                  <p className="text-2xl text-gray-900">₹{rates.gold22k}</p>
                  <p className="text-xs text-gray-500 mt-1">per gram</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">24K Gold</p>
                  <p className="text-2xl text-gray-900">₹{rates.gold24k}</p>
                  <p className="text-xs text-gray-500 mt-1">per gram</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Silver</p>
                  <p className="text-2xl text-gray-900">₹{rates.silver}</p>
                  <p className="text-xs text-gray-500 mt-1">per gram</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Quick Calculator</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">10 grams (22K)</span>
                  <span className="text-gray-900">
                    ₹{(parseFloat(rates.gold22k) * 10).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">10 grams (24K)</span>
                  <span className="text-gray-900">
                    ₹{(parseFloat(rates.gold24k) * 10).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">100 grams (Silver)</span>
                  <span className="text-gray-900">
                    ₹{(parseFloat(rates.silver) * 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate History */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Recent Updates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-sm text-gray-700">
                    22K Gold (₹/gram)
                  </th>
                  <th className="text-right px-6 py-4 text-sm text-gray-700">
                    24K Gold (₹/gram)
                  </th>
                  <th className="text-right px-6 py-4 text-sm text-gray-700">
                    Silver (₹/gram)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((row, index) => (
                  <tr
                    key={row.date}
                    className={index === 0 ? "bg-yellow-50" : "hover:bg-gray-50"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {row.date}
                      {index === 0 && (
                        <span className="ml-2 text-xs text-yellow-600">(Today)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      ₹{row.gold22k.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      ₹{row.gold24k.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900">
                      ₹{row.silver.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
