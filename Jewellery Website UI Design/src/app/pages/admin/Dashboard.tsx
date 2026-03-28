import { useState } from "react";
import { Link } from "react-router";
import {
  LogOut,
  Package2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { useGoldRates } from "../../hooks/useGoldRates";
import { useProducts } from "../../hooks/useProducts";
import {
  clearAdminSession,
  getAdminSession,
  saveAdminSession,
} from "../../lib/adminSession";
import { formatRate } from "../../lib/goldRateDisplay";
import {
  formatProductPrice,
  getProductCategoryLabel,
  PRODUCT_CATEGORY_OPTIONS,
} from "../../lib/productDisplay";
import { adminLogin } from "../../lib/productsApi";

export function AdminDashboard() {
  const [session, setSession] = useState(() => getAdminSession());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const { products, loading: productsLoading } = useProducts();
  const { displayData, loading: ratesLoading } = useGoldRates();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoginLoading(true);
      setLoginError(null);
      const response = await adminLogin(password);
      const nextSession = {
        token: response.token,
        loggedInAt: new Date().toISOString(),
      };
      saveAdminSession(nextSession);
      setSession(nextSession);
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    clearAdminSession();
    setSession(null);
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#fffdf8] px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#eadfc5] bg-gradient-to-br from-[#f8f5ec] to-[#f3e7c9] p-8 shadow-md">
            <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
              Admin Access
            </p>
            <h1 className="mt-3 text-3xl text-slate-900 sm:text-4xl">
              Manage products, uploads, and live catalogue content.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Use the simple password login to add jewellery products, upload images,
              and keep the public catalogue updated instantly across mobile and desktop.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                "Add products with image uploads",
                "Delete products instantly",
                "Sync catalogue to the public website",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/70 bg-white/60 p-4 text-sm text-slate-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-8 shadow-md">
            <h2 className="text-2xl text-slate-900">Admin Login</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the configured backend admin password to open the management panel.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm text-slate-700">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
                  placeholder="Enter admin password"
                />
              </div>

              {loginError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ShieldCheck className="h-4 w-4" />
                {loginLoading ? "Signing in..." : "Open Admin Panel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const categoryBreakdown = PRODUCT_CATEGORY_OPTIONS.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.id).length,
  }));

  return (
    <div className="min-h-screen bg-[#fffdf8] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl text-slate-900 sm:text-4xl">
              Welcome back to the catalogue studio.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Add premium jewellery listings, keep the public collection fresh, and
              monitor the live gold-rate feed used by the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfc5] px-5 py-3 text-sm text-slate-700 transition hover:bg-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Products",
              value: productsLoading ? "..." : String(products.length),
              text: "Live catalogue entries",
              icon: Package2,
            },
            {
              title: "22K Gold",
              value: ratesLoading ? "..." : `Rs. ${formatRate(displayData.gold_22k)}`,
              text: "Current live rate per gram",
              icon: TrendingUp,
            },
            {
              title: "Featured Categories",
              value: String(
                categoryBreakdown.filter((category) => category.count > 0).length,
              ),
              text: "Collections visible online",
              icon: Sparkles,
            },
            {
              title: "Status",
              value: "Active",
              text: "Frontend and backend connected",
              icon: ShieldCheck,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-[1.75rem] border border-[#eadfc5] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="mt-3 text-2xl text-slate-900">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-600">{stat.text}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3d1] text-[#b88a2f]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <h2 className="text-2xl text-slate-900">Quick Actions</h2>
            <div className="mt-5 space-y-3">
              {[
                {
                  title: "Manage Products",
                  description: "Upload images, add titles, categories, pricing, and descriptions.",
                  path: "/admin/products",
                },
                {
                  title: "Gold Rate Monitor",
                  description: "Review the live rate feed that powers the customer-facing page.",
                  path: "/admin/gold-rate",
                },
                {
                  title: "View Public Store",
                  description: "Open the live customer experience and verify premium layout quality.",
                  path: "/products",
                },
              ].map((action) => (
                <Link
                  key={action.title}
                  to={action.path}
                  className="block rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <h3 className="text-lg text-slate-900">{action.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <h2 className="text-2xl text-slate-900">Recent Catalogue Snapshot</h2>
            <div className="mt-5 space-y-3">
              {products.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg text-slate-900">{product.title}</p>
                      <p className="text-sm text-slate-600">
                        {getProductCategoryLabel(product.category)}
                      </p>
                    </div>
                    <p className="text-base text-slate-900">
                      {formatProductPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}

              {!productsLoading && products.length === 0 && (
                <div className="rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] p-4 text-sm text-slate-600">
                  No products are listed yet. Add your first design from the products page.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryBreakdown.map((category) => (
            <div
              key={category.id}
              className="rounded-[1.75rem] border border-[#eadfc5] bg-gradient-to-br from-white to-[#fff7e8] p-5 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.18em] text-[#b88a2f]">
                {category.label}
              </p>
              <p className="mt-3 text-3xl text-slate-900">{category.count}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
