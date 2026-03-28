import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Award,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useProducts } from "../hooks/useProducts";
import { resolveAssetUrl } from "../lib/api";
import { formatProductPrice, getProductCategoryLabel } from "../lib/productDisplay";

export function ProductDetails() {
  const { id } = useParams();
  const { products, loading } = useProducts();

  const product = products.find((item) => item.id === id);
  const relatedProducts = products
    .filter((item) => item.id !== id && item.category === product?.category)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf8] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-[2rem] bg-[#f4ead6]" />
            <div className="space-y-4">
              <div className="h-5 w-24 animate-pulse rounded bg-[#f4ead6]" />
              <div className="h-12 w-2/3 animate-pulse rounded bg-[#f4ead6]" />
              <div className="h-6 w-40 animate-pulse rounded bg-[#f4ead6]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#f4ead6]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fffdf8] px-4 py-16 md:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#eadfc5] bg-white p-8 text-center shadow-md">
          <h1 className="text-3xl text-slate-900">Product not found</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            This design may have been removed from the catalogue. Browse the latest
            collection to discover currently available jewellery.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f]"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fffdf8]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 sm:py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div className="overflow-hidden rounded-[2rem] border border-[#eadfc5] bg-white p-3 shadow-md">
            <ImageWithFallback
              src={resolveAssetUrl(product.image)}
              alt={product.title}
              className="aspect-square w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
                {getProductCategoryLabel(product.category)}
              </p>
              <h1 className="text-3xl text-slate-900 sm:text-4xl">{product.title}</h1>
              <p className="text-2xl text-slate-900 sm:text-3xl">
                {formatProductPrice(product.price)}
              </p>
              <p className="text-sm leading-7 text-slate-600 sm:text-base">
                {product.description}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: ShieldCheck,
                    title: "BIS Hallmarked",
                    text: "Every purchase is backed by trusted certification and transparent quality guidance.",
                  },
                  {
                    icon: Award,
                    title: "Premium Finish",
                    text: "Designed for graceful styling, gifting, and occasion-led jewellery wardrobes.",
                  },
                  {
                    icon: Sparkles,
                    title: "Made to Shine",
                    text: "A polished final finish that works beautifully for close-up wear and wedding looks.",
                  },
                  {
                    icon: Phone,
                    title: "Store Assistance",
                    text: "Call or WhatsApp for exact quotation, making charges, and in-store availability.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-[#f3ead7] bg-[#fffaf0] p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#b88a2f] shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="mt-3 text-lg text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="https://wa.me/919363161304"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f] md:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
              </a>
              <a
                href="tel:+919363161304"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-slate-800 transition hover:bg-white md:w-auto"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </a>
            </div>

            <div className="rounded-2xl border border-[#eadfc5] bg-[#fff9ec] p-5 text-sm leading-7 text-slate-600">
              Final price varies based on live gold rate, design complexity, and making
              charges. Contact the showroom for an exact quotation before purchase.
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
                  More to Explore
                </p>
                <h2 className="mt-2 text-2xl text-slate-900 sm:text-3xl">
                  Related jewellery in the same category
                </h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-[#b88a2f]"
              >
                View full catalogue
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="overflow-hidden">
                    <ImageWithFallback
                      src={resolveAssetUrl(relatedProduct.image)}
                      alt={relatedProduct.title}
                      className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
                      {getProductCategoryLabel(relatedProduct.category)}
                    </p>
                    <h3 className="text-xl text-slate-900">{relatedProduct.title}</h3>
                    <p className="text-base text-slate-900">
                      {formatProductPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
