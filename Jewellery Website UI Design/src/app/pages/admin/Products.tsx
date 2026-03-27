import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "rings", "necklaces", "earrings", "bangles"];

  const products = [
    {
      id: 1,
      name: "Elegant Gold Chain",
      category: "necklaces",
      weight: "15.5g",
      purity: "22K",
      status: "active",
      image: "https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?w=100",
    },
    {
      id: 2,
      name: "Wedding Ring Set",
      category: "rings",
      weight: "12.5g",
      purity: "22K",
      status: "active",
      image: "https://images.unsplash.com/photo-1654521883301-070279dd0ae1?w=100",
    },
    {
      id: 3,
      name: "Pink Gold Earrings",
      category: "earrings",
      weight: "6.5g",
      purity: "22K",
      status: "active",
      image: "https://images.unsplash.com/photo-1645994044915-a67a383f7c6a?w=100",
    },
    {
      id: 4,
      name: "Traditional Bangles",
      category: "bangles",
      weight: "35.5g",
      purity: "22K",
      status: "active",
      image: "https://images.unsplash.com/photo-1679156271456-d6068c543ee7?w=100",
    },
    {
      id: 5,
      name: "Pearl Gold Necklace",
      category: "necklaces",
      weight: "18.2g",
      purity: "22K",
      status: "active",
      image: "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?w=100",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-gray-900 mb-2">Manage Products</h1>
            <p className="text-gray-600">
              Add, edit, or remove products from your collection
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors shadow-md">
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent capitalize"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Product
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Weight
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Purity
                  </th>
                  <th className="text-left px-6 py-4 text-sm text-gray-700">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-sm text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.weight}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.purity}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button className="px-4 py-2 text-sm text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors">
                  1
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
