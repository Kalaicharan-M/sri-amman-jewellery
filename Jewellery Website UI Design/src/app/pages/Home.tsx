import { Link } from "react-router";
import {
  ArrowRight,
  Award,
  Clock3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductContactCta } from "../components/ProductContactCta";
import { useGoldRates } from "../hooks/useGoldRates";
import { useProducts } from "../hooks/useProducts";
import { resolveAssetUrl } from "../lib/api";
import { CONTACT_WHATSAPP_BASE_URL } from "../lib/contact";
import { formatLastUpdated, formatRate } from "../lib/goldRateDisplay";
import {
  getProductCategoryLabel,
  PRODUCT_CATEGORY_OPTIONS,
} from "../lib/productDisplay";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md">
      <div className="h-[220px] animate-pulse bg-[#f4ead6]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#f4ead6]" />
      </div>
    </div>
  );
}

export function Home() {
  const { displayData, loading: goldLoading, error: goldError } = useGoldRates();
  const { products, loading: productsLoading } = useProducts();

  const featuredProducts = products.slice(0, 4);
  const categoryCards = PRODUCT_CATEGORY_OPTIONS.map((category) => {
    const count = products.filter((product) => product.category === category.id).length;
    return {
      ...category,
      count,
    };
  });

  const refreshIntervalMinutes = displayData.cache_ttl_minutes ?? 5;

  return (
    <div className="overflow-x-hidden bg-[#fffdf8]">
      <section className="relative overflow-hidden bg-gradient-to-r from-[#f8f5ec] to-[#f3e7c9]">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#f7d48a]/40 blur-3xl" />
          <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-[#d8b15a]/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-white/70 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-4 py-10 md:flex-row md:px-8 md:py-16 lg:py-20">
          <div className="w-full space-y-4 md:w-1/2 md:space-y-6 animate-[fadeUp_640ms_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ddc694] bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#b88a2f]">
              <Sparkles className="h-4 w-4" />
              Crafted For Celebrations
            </div>
            <h1 className="max-w-xl text-2xl leading-tight text-slate-900 sm:text-3xl lg:text-5xl">
              Premium jewellery with a warm gold heritage and a modern luxury finish.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover bridal necklaces, signature rings, elegant earrings, and
              handcrafted bangles designed to feel timeless in every photograph and
              unforgettable in every celebration.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f] md:w-auto"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/gold-rate"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-slate-800 transition hover:bg-white/70 md:w-auto"
              >
                Today's Gold Rate
                <TrendingUp className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
              {[
                { label: "Hallmarked trust", value: "BIS" },
                { label: "Live rate sync", value: `${refreshIntervalMinutes} min` },
                { label: "Store legacy", value: "30+ yrs" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-lg text-slate-900">{item.value}</p>
                  <p className="mt-1 text-xs text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 animate-[fadeUp_760ms_ease-out]">
            <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/40 p-3 shadow-[0_30px_80px_rgba(97,75,21,0.16)] backdrop-blur">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Premium Sri Amman Jewellery collection"
                className="h-[250px] w-full rounded-2xl object-cover shadow-lg md:h-[450px] md:w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 sm:py-16">
        <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-5 shadow-md sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
                Live Gold Rate
              </p>
              <h2 className="mt-2 text-2xl text-slate-900 sm:text-3xl">
                Today's gold and silver pricing
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {goldLoading
                  ? "Fetching the latest market update."
                  : `Last updated: ${formatLastUpdated(displayData.last_updated)}`}
              </p>
              {goldError && (
                <p className="mt-2 text-sm text-red-600">
                  Live feed unavailable. Showing the last reliable rate snapshot.
                </p>
              )}
            </div>
            <Link
              to="/gold-rate"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadfc5] px-6 py-3 text-slate-800 transition hover:bg-[#fff9ec] sm:w-auto"
            >
              View detailed history
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                label: "22K Gold",
                value: displayData.gold_22k,
                accent: "from-[#fff7df] to-[#f7edd1]",
              },
              {
                label: "24K Gold",
                value: displayData.gold_24k,
                accent: "from-[#fff7df] to-[#f7edd1]",
              },
              {
                label: "Silver",
                value: displayData.silver,
                accent: "from-[#fafafa] to-[#f0f0f0]",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl border border-[#f0e6d2] bg-gradient-to-br ${item.accent} p-5 shadow-sm`}
              >
                <p className="text-sm text-slate-600">{item.label}</p>
                <p className="mt-3 text-3xl text-slate-900">
                  {goldLoading ? "Loading..." : `Rs. ${formatRate(item.value)}`}
                </p>
                <p className="mt-2 text-sm text-slate-500">per gram</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
                Signature Collections
              </p>
              <h2 className="mt-2 text-2xl text-slate-900 sm:text-3xl">
                Bestselling jewellery selected for modern celebrations
              </h2>
            </div>
            <Link
              to="/products"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadfc5] px-6 py-3 text-slate-800 transition hover:bg-white sm:w-auto"
            >
              Browse all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : featuredProducts.map((product) => {
                  const categoryLabel = getProductCategoryLabel(product.category);

                  return (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Link
                        to={`/products/${product.id}`}
                        className="group block overflow-hidden"
                      >
                        <ImageWithFallback
                          src={resolveAssetUrl(product.image)}
                          alt={product.title}
                          className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <div className="space-y-3 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
                          {categoryLabel}
                        </p>
                        <Link
                          to={`/products/${product.id}`}
                          className="block text-xl text-slate-900 transition hover:text-[#b88a2f]"
                        >
                          {product.title}
                        </Link>
                        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                          {product.description}
                        </p>
                        <ProductContactCta
                          productName={product.title}
                          categoryLabel={categoryLabel}
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="rounded-2xl border border-[#eadfc5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3d1] text-[#b88a2f]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl text-slate-900">{category.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {category.description}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                {category.count} designs currently listed
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#1f1712] py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 md:px-8">
          {[
            {
              title: "BIS Hallmarked",
              description: "Authentic gold backed by trusted certification.",
              icon: Award,
            },
            {
              title: "Transparent Pricing",
              description: "Live gold rates with clear quotation support.",
              icon: TrendingUp,
            },
            {
              title: "Skilled Craftsmanship",
              description: "Designed to feel premium in person and in every frame.",
              icon: Sparkles,
            },
            {
              title: "Lifetime Service",
              description: "Cleaning, guidance, and long-term relationship care.",
              icon: Clock3,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 text-[#f5ecd9]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8b15a]/20 text-[#e7c777]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-xl text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#d8c6a0]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 sm:py-16">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#f8f5ec] to-[#f3e7c9] p-6 shadow-md sm:p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
                Visit Our Showroom
              </p>
              <h2 className="mt-2 text-2xl text-slate-900 sm:text-3xl">
                Experience the finish, brilliance, and craftsmanship in person.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Walk in for bridal consultations, gifting guidance, live quotations,
                and a closer look at our signature collection.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f] md:w-auto"
              >
                Get Directions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={CONTACT_WHATSAPP_BASE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-slate-800 transition hover:bg-white/70 md:w-auto"
              >
                Chat on WhatsApp
                <ShieldCheck className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
