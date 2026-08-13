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
    <div className="overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-sm">
      <div className="aspect-[4/5] animate-pulse bg-[#f4ead6]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f4ead6]" />
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8f5ec] via-[#f8f5ec] to-[#f3e7c9]">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[#f7d48a]/40 blur-3xl sm:h-48 sm:w-48" />
          <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-[#d8b15a]/25 blur-3xl sm:h-64 sm:w-64" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/70 blur-3xl sm:h-40 sm:w-40" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-10 sm:gap-10 sm:px-6 md:flex-row md:justify-between md:py-16 lg:px-8 lg:py-24">
          <div className="w-full space-y-5 md:w-1/2 md:space-y-6 animate-[fadeUp_640ms_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ddc694] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#b88a2f] sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Crafted For Celebrations
            </div>
            <h1 className="max-w-xl text-[1.75rem] leading-[1.15] text-slate-900 sm:text-4xl lg:text-5xl lg:leading-tight">
              Premium jewellery with a warm gold heritage and a modern luxury finish.
            </h1>
            <p className="max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-lg">
              Discover bridal necklaces, signature rings, elegant earrings, and
              handcrafted bangles designed to feel timeless in every photograph and
              unforgettable in every celebration.
            </p>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3.5 text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#b88a2f] hover:shadow-lg sm:py-3 md:w-auto"
              >
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/gold-rate"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/60 px-6 py-3.5 text-slate-800 backdrop-blur transition hover:bg-white sm:py-3 md:w-auto"
              >
                Today&apos;s Gold Rate
                <TrendingUp className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-3 sm:gap-4 sm:pt-4">
              {[
                { label: "Hallmarked trust", value: "BIS" },
                { label: "Live rate sync", value: `${refreshIntervalMinutes} min` },
                { label: "Store legacy", value: "30+ yrs" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/70 bg-white/60 px-2.5 py-3 text-center shadow-sm backdrop-blur sm:rounded-2xl sm:px-4 sm:text-left"
                >
                  <p className="text-base text-slate-900 sm:text-lg">{item.value}</p>
                  <p className="mt-1 text-[11px] leading-tight text-slate-600 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm md:w-1/2 md:max-w-xl animate-[fadeUp_760ms_ease-out]">
            <div className="relative mx-auto max-w-xl">
              <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/40 p-2.5 shadow-[0_30px_80px_rgba(97,75,21,0.16)] backdrop-blur sm:rounded-[2rem] sm:p-3">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Premium Sri Amman Jewellery collection"
                  className="aspect-[4/3] w-full rounded-xl object-cover shadow-lg sm:aspect-[16/11] sm:rounded-2xl md:h-[420px] md:aspect-auto"
                />
              </div>
              <div className="absolute -bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs text-slate-800 shadow-lg sm:-bottom-5 sm:left-6 sm:px-4 sm:py-3 sm:text-sm">
                <ShieldCheck className="h-4 w-4 text-[#b88a2f]" />
                BIS Hallmarked Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Gold Rate */}
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
        <div className="rounded-[1.75rem] border border-[#eadfc5] bg-white p-5 shadow-md sm:rounded-[2rem] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#b88a2f] sm:text-sm">
                Live Gold Rate
              </p>
              <h2 className="mt-2 text-xl text-slate-900 sm:text-2xl lg:text-3xl">
                Today&apos;s gold and silver pricing
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

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { label: "22K Gold", value: displayData.gold_22k },
              { label: "24K Gold", value: displayData.gold_24k },
              { label: "Silver", value: displayData.silver },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#f0e6d2] bg-gradient-to-br from-[#fff7df] to-[#f7edd1] p-4 shadow-sm sm:p-5"
              >
                <p className="text-sm text-slate-600">{item.label}</p>
                <p className="mt-2 text-2xl text-slate-900 sm:mt-3 sm:text-3xl">
                  {goldLoading ? "Loading..." : `Rs. ${formatRate(item.value)}`}
                </p>
                <p className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm">per gram</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Collections */}
      <section className="bg-[#fffaf0] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#b88a2f] sm:text-sm">
                Signature Collections
              </p>
              <h2 className="mt-2 text-xl text-slate-900 sm:text-2xl lg:text-3xl">
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

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : featuredProducts.map((product) => {
                  const categoryLabel = getProductCategoryLabel(product.category);

                  return (
                    <div
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Link
                        to={`/products/${product.id}`}
                        className="block overflow-hidden"
                      >
                        <ImageWithFallback
                          src={resolveAssetUrl(product.image)}
                          alt={product.title}
                          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </Link>
                      <div className="space-y-2 p-3 sm:p-4">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#b88a2f] sm:text-xs">
                          {categoryLabel}
                        </p>
                        <Link
                          to={`/products/${product.id}`}
                          className="block text-sm text-slate-900 transition hover:text-[#b88a2f] sm:text-lg"
                        >
                          {product.title}
                        </Link>
                        <p className="hidden text-sm leading-6 text-slate-600 sm:line-clamp-2 sm:block">
                          {product.description}
                        </p>
                        <ProductContactCta
                          productName={product.title}
                          categoryLabel={categoryLabel}
                          compact
                          labelClassName="text-xs text-slate-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="rounded-2xl border border-[#eadfc5] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3d1] text-[#b88a2f] sm:h-12 sm:w-12">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <h3 className="mt-3 text-base text-slate-900 sm:mt-4 sm:text-xl">
                {category.label}
              </h3>
              <p className="mt-1.5 hidden text-sm leading-6 text-slate-600 sm:mt-2 sm:block">
                {category.description}
              </p>
              <p className="mt-2 text-xs text-slate-500 sm:mt-4 sm:text-sm">
                {category.count} designs
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust features */}
      <section className="bg-[#1f1712] py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:gap-5 sm:px-6 lg:grid-cols-4 lg:px-8">
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
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-[#f5ecd9] sm:p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8b15a]/20 text-[#e7c777] sm:h-12 sm:w-12">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="mt-3 text-base text-white sm:mt-4 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1.5 hidden text-sm leading-6 text-[#d8c6a0] sm:mt-2 sm:block">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Showroom CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-[#f8f5ec] to-[#f3e7c9] p-6 shadow-md sm:rounded-[2rem] sm:p-8 md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[#b88a2f] sm:text-sm">
                Visit Our Showroom
              </p>
              <h2 className="mt-2 text-xl text-slate-900 sm:text-2xl lg:text-3xl">
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
