import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Filter } from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );

  const categories = [
    { id: "all", name: "All Products" },
    { id: "rings", name: "Rings" },
    { id: "necklaces", name: "Necklaces" },
    { id: "earrings", name: "Earrings" },
    { id: "bangles", name: "Bangles" },
  ];

  const products = [
    {
      id: "1",
      name: "Elegant Gold Chain",
      category: "necklaces",
      weight: "15.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "2",
      name: "Pearl Gold Necklace",
      category: "necklaces",
      weight: "18.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "3",
      name: "Cross Pendant Necklace",
      category: "necklaces",
      weight: "12.3g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1612813411142-8eb444ff0dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "4",
      name: "Traditional Gold Rings",
      category: "rings",
      weight: "8.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "5",
      name: "Delicate Gold Necklace",
      category: "necklaces",
      weight: "10.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1731406322316-e4aadc43a734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "6",
      name: "Shell Design Necklace",
      category: "necklaces",
      weight: "14.8g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1672646858147-2f9ddb140191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "7",
      name: "Layered Gold Necklace",
      category: "necklaces",
      weight: "16.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1642373174965-ef3793eabcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "8",
      name: "Diamond Pendant",
      category: "necklaces",
      weight: "11.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1611583027838-515a1087afdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "9",
      name: "Wedding Ring Set",
      category: "rings",
      weight: "12.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1654521883301-070279dd0ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "10",
      name: "Designer Ring Set",
      category: "rings",
      weight: "10.8g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1708551413300-4ade9d984570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "11",
      name: "Bridal Ring Collection",
      category: "rings",
      weight: "14.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1640183295764-8dd9f9fd6139?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "12",
      name: "Elegant Gold Ring",
      category: "rings",
      weight: "9.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1731406322133-e908c0ed1407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "13",
      name: "Pink Gold Earrings",
      category: "earrings",
      weight: "6.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1645994044915-a67a383f7c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "14",
      name: "Star Stud Earrings",
      category: "earrings",
      weight: "5.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1561172478-a203d9c8290e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "15",
      name: "Amethyst Earrings",
      category: "earrings",
      weight: "7.8g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1645993261661-dde7f59f25b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "16",
      name: "Traditional Bangles",
      category: "bangles",
      weight: "35.5g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1679156271456-d6068c543ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlcyUyMGpld2VsbGVyeXxlbnwxfHx8fDE3NzQ1MzgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "17",
      name: "Diamond Bangles",
      category: "bangles",
      weight: "42.2g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1611598935678-c88dca238fce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnb2xkJTIwYmFuZ2xlcyUyMGpld2VsbGVyeXxlbnwxfHx8fDE3NzQ1MzgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "18",
      name: "Designer Gold Bangles",
      category: "bangles",
      weight: "38.8g",
      purity: "22K",
      image:
        "https://images.unsplash.com/photo-1768359666502-306694fa6fcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxMHx8Z29sZCUyMGJhbmdsZXMlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);

    if (categoryId === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: categoryId });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-3 sm:mb-4">
            Our Collection
          </h1>
          <p className="max-w-2xl text-base sm:text-xl text-gray-600">
            Explore our exquisite range of handcrafted gold jewellery.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900">Filter by Category</h3>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full sm:w-auto px-5 py-3 rounded-lg text-sm sm:text-base transition-all ${
                  selectedCategory === category.id
                    ? "bg-yellow-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600">
            Showing {filteredProducts.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <div className="overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 sm:p-5">
                <h3 className="text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {product.name}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>{product.purity}</span>
                  <span className="text-gray-300">/</span>
                  <span>{product.weight}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-yellow-600 capitalize">
                    {product.category}
                  </span>
                  <span className="text-sm text-gray-500 group-hover:text-yellow-600 transition-colors">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-white py-16 sm:py-20 text-center shadow-sm">
            <p className="text-base sm:text-xl text-gray-600">
              No products found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
