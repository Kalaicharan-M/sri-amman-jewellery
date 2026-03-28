import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts } from "../hooks/useProducts";
import { resolveAssetUrl } from "../lib/api";
import {
  formatProductPrice,
  getProductCategoryLabel,
  PRODUCT_CATEGORY_OPTIONS,
} from "../lib/productDisplay";

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md">
      <div className="h-[220px] animate-pulse bg-[#f4ead6]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-24 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-[#f4ead6]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f4ead6]" />
      </div>
    </div>
  );
}

function normalizeCategory(value: string | null) {
  if (!value) {
    return "all";
  }

  if (value === "necklaces") {
    return "necklace";
  }

  return value;
}

export function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error } = useProducts();
  const selectedCategory = normalizeCategory(searchParams.get("category"));

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf8]">
      <section className="bg-gradient-to-r from-[#f8f5ec] to-[#f3e7c9] py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
            Curated Jewellery Catalogue
          </p>
          <h1 className="mt-3 text-3xl text-slate-900 sm:text-4xl lg:text-5xl">
            Explore premium designs crafted for weddings, gifting, and everyday elegance.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            Browse dynamic product listings from the Flask backend, filter by category,
            and discover styles that balance heritage detail with a refined modern finish.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 sm:py-16">
        <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-5 shadow-md sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search necklace, bangles, earrings..."
                className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-12 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  selectedCategory === "all"
                    ? "bg-[#c89b3c] text-white"
                    : "border border-[#eadfc5] text-slate-700 hover:bg-[#fff9ec]"
                }`}
              >
                All Products
              </button>
              {PRODUCT_CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSearchParams({ category: category.id })}
                  className={`rounded-xl px-4 py-3 text-sm transition ${
                    selectedCategory === category.id
                      ? "bg-[#c89b3c] text-white"
                      : "border border-[#eadfc5] text-slate-700 hover:bg-[#fff9ec]"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>{loading ? "Loading products..." : `Showing ${filteredProducts.length} designs`}</p>
            <p>Mobile-first browsing with live product data from Flask</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)
            : filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <ImageWithFallback
                      src={resolveAssetUrl(product.image)}
                      alt={product.title}
                      className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
                      {getProductCategoryLabel(product.category)}
                    </p>
                    <h3 className="text-xl text-slate-900">{product.title}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-base text-slate-900">
                        {formatProductPrice(product.price)}
                      </span>
                      <span className="text-sm text-slate-500 transition group-hover:text-[#b88a2f]">
                        View Details
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="mt-8 rounded-2xl border border-[#eadfc5] bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl text-slate-900">No products found</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Try a different category or search phrase to explore more jewellery designs.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
