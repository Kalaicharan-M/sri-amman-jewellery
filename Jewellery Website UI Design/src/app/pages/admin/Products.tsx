import { useState } from "react";
import { Link, Navigate } from "react-router";
import { ImagePlus, Trash2 } from "lucide-react";

import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useProducts } from "../../hooks/useProducts";
import { resolveAssetUrl } from "../../lib/api";
import { clearAdminSession, getAdminSession } from "../../lib/adminSession";
import {
  getProductCategoryLabel,
  PRODUCT_CATEGORY_OPTIONS,
} from "../../lib/productDisplay";
import { createProduct, deleteProduct, type ProductCategory } from "../../lib/productsApi";

export function AdminProducts() {
  const session = getAdminSession();
  const { products, loading, error, reload } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | ProductCategory>("all");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProductCategory>("rings");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      query === "" ||
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!imageFile) {
      setFormError("Please upload a product image.");
      return;
    }

    try {
      setSubmitLoading(true);
      setFormError(null);
      setSuccessMessage(null);
      await createProduct(
        {
          title,
          category,
          price,
          description,
          imageFile,
        },
        session.token,
      );

      setTitle("");
      setCategory("rings");
      setPrice("");
      setDescription("");
      setImageFile(null);
      setSuccessMessage("Product added successfully and is now visible on the website.");
      await reload();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to create product.";
      setFormError(message);

      if (message === "Admin login required.") {
        clearAdminSession();
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete(productId: string) {
    const shouldDelete = window.confirm("Delete this product from the catalogue?");
    if (!shouldDelete) {
      return;
    }

    try {
      setDeleteLoadingId(productId);
      setFormError(null);
      setSuccessMessage(null);
      await deleteProduct(productId, session.token);
      setSuccessMessage("Product deleted successfully.");
      await reload();
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Unable to delete product.";
      setFormError(message);

      if (message === "Admin login required.") {
        clearAdminSession();
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#fffdf8] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#b88a2f]">
              Product Management
            </p>
            <h1 className="mt-2 text-3xl text-slate-900 sm:text-4xl">
              Add, review, and remove jewellery listings.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Upload new product images, set category and pricing, then see changes
              reflected immediately in the public storefront.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-[#eadfc5] px-5 py-3 text-sm text-slate-700 transition hover:bg-white"
          >
            Preview public catalogue
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <h2 className="text-2xl text-slate-900">Add Product</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Fill in the essentials: image, title, category, price, and a short luxury-focused description.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-sm text-slate-700">
                  Product title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
                  placeholder="Temple Gold Necklace"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value as ProductCategory)}
                    className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
                  >
                    {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="mb-2 block text-sm text-slate-700">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    min="1"
                    required
                    className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
                    placeholder="125000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#c89b3c]"
                  placeholder="Describe the design, finish, and the occasion it suits best."
                />
              </div>

              <div>
                <label htmlFor="image" className="mb-2 block text-sm text-slate-700">
                  Product image
                </label>
                <label
                  htmlFor="image"
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d8c08f] bg-[#fffaf0] px-6 py-8 text-center transition hover:bg-[#fff6df]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#b88a2f] shadow-sm">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">
                      {imageFile ? imageFile.name : "Click to upload a JPG, PNG, or WEBP image"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      High-quality vertical or square images work best for the premium card layout.
                    </p>
                  </div>
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </div>

              {(formError || successMessage) && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    formError
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {formError || successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#c89b3c] px-6 py-3 text-white shadow-md transition hover:bg-[#b88a2f] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitLoading ? "Uploading product..." : "Add Product"}
              </button>
            </form>
          </div>

          <div className="rounded-[2rem] border border-[#eadfc5] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl text-slate-900">Live Products</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Manage the products currently visible in the public catalogue.
                </p>
              </div>
              <p className="text-sm text-slate-500">
                {loading ? "Loading..." : `${filteredProducts.length} visible items`}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search title or description"
                className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
              />
              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value as "all" | ProductCategory)
                }
                className="w-full rounded-xl border border-[#eadfc5] bg-[#fffdf8] px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#c89b3c]"
              >
                <option value="all">All Categories</option>
                {PRODUCT_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 gap-4 rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] p-4 lg:grid-cols-[110px_1fr_auto]"
                >
                  <div className="overflow-hidden rounded-2xl bg-white">
                    <ImageWithFallback
                      src={resolveAssetUrl(product.image)}
                      alt={product.title}
                      className="h-28 w-full object-cover lg:h-28 lg:w-[110px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xl text-slate-900">{product.title}</h3>
                      <p className="text-sm font-medium text-[#b88a2f]">
                        Price hidden on storefront
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#b88a2f]">
                      {getProductCategoryLabel(product.category)}
                    </p>
                    <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                    <Link
                      to={`/products/${product.id}`}
                      className="inline-flex text-sm text-slate-500 transition hover:text-[#b88a2f]"
                    >
                      View on public site
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteLoadingId === product.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleteLoadingId === product.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}

              {!loading && filteredProducts.length === 0 && (
                <div className="rounded-2xl border border-[#f0e6d2] bg-[#fffaf0] px-5 py-12 text-center text-sm text-slate-600">
                  No products match the current filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
