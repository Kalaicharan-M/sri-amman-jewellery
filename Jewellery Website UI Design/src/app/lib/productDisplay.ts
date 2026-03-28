import type { ProductCategory } from "./productsApi";

export const PRODUCT_CATEGORY_OPTIONS: Array<{
  id: ProductCategory;
  label: string;
  description: string;
}> = [
  {
    id: "rings",
    label: "Rings",
    description: "Bold silhouettes and fine finishing for gifting and milestones.",
  },
  {
    id: "necklace",
    label: "Necklaces",
    description: "Statement bridal and occasion-ready necklaces with rich detailing.",
  },
  {
    id: "earrings",
    label: "Earrings",
    description: "Everyday sparkle and festive elegance in lightweight styles.",
  },
  {
    id: "bangles",
    label: "Bangles",
    description: "Classic pairs and modern stacks crafted for timeless wear.",
  },
];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  rings: "Rings",
  necklace: "Necklaces",
  earrings: "Earrings",
  bangles: "Bangles",
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function getProductCategoryLabel(category: ProductCategory) {
  return CATEGORY_LABELS[category] ?? category;
}

export function formatProductPrice(price: number) {
  return priceFormatter.format(price);
}
