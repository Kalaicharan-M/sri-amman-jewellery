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
import { ProductContactCta } from "../components/ProductContactCta";
import { useProducts } from "../hooks/useProducts";
import { resolveAssetUrl } from "../lib/api";
import {
  buildProductWhatsAppLink,
  CONTACT_TEL_LINK,
} from "../lib/contact";
import { getProductCategoryLabel } from "../lib/productDisplay";

export function ProductDetails() {
  const { id } = useParams();
  const { products, loading } = useProducts();

  const product = products.find((item) => item.id === id);
  const relatedProducts = products
    .filter((item) => item.id !== id && item.category === product?.category)
    .slice(0, 3);
  const categoryLabel = product ? getProductCategoryLabel(product.category) : "";
  const whatsappLink = product
    ? buildProductWhatsAppLink(product.title, categoryLabel)
    : "";

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
                {categoryLabel}
              </p>
              <h1 className="text-3xl text-slate-900 sm:text-4xl">{product.title}</h1>
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

            <div className="rounded-[2rem] border border-[#eadfc5] bg-gradient-to-br from-[#fffaf0] to-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-[#b88a2f]">
                Price on Request
              </p>
              <h2 className="mt-2 text-2xl text-slate-900">
                Connect with our team for pricing and availability.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We will share the latest quote, making charges, and showroom availability
                for this {categoryLabel.toLowerCase()} design.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={CONTACT_TEL_LINK}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#c89b3c] px-4 py-2 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#b88a2f]"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-500 px-4 py-2 text-green-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eadfc5] bg-[#fff9ec] p-5 text-sm leading-7 text-slate-600">
              Contact us for a tailored quote, current making charges, and the latest
              availability for this jewellery piece.
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
              {relatedProducts.map((relatedProduct) => {
                const relatedCategoryLabel = getProductCategoryLabel(relatedProduct.category);

                return (
                  <div
                    key={relatedProduct.id}
                    className="overflow-hidden rounded-2xl border border-[#f0e6d2] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="group block overflow-hidden"
                    >
                      <ImageWithFallback
                        src={resolveAssetUrl(relatedProduct.image)}
                        alt={relatedProduct.title}
                        className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="space-y-2 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
                        {relatedCategoryLabel}
                      </p>
                      <Link
                        to={`/products/${relatedProduct.id}`}
                        className="block text-xl text-slate-900 transition hover:text-[#b88a2f]"
                      >
                        {relatedProduct.title}
                      </Link>
                      <ProductContactCta
                        productName={relatedProduct.title}
                        categoryLabel={relatedCategoryLabel}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
