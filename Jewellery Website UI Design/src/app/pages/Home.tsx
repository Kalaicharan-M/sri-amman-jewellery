import { Link } from "react-router";
import { ArrowRight, Award, Clock, Shield, TrendingUp } from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useGoldRates } from "../hooks/useGoldRates";
import { formatLastUpdated, formatRate } from "../lib/goldRateDisplay";

export function Home() {
  const { displayData, loading, error } = useGoldRates();

  const featuredProducts = [
    {
      id: "1",
      name: "Elegant Gold Necklace",
      image:
        "https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Necklaces",
    },
    {
      id: "2",
      name: "Traditional Wedding Ring Set",
      image:
        "https://images.unsplash.com/photo-1654521883301-070279dd0ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Rings",
    },
    {
      id: "3",
      name: "Gold Stud Earrings",
      image:
        "https://images.unsplash.com/photo-1645994044915-a67a383f7c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Earrings",
    },
    {
      id: "4",
      name: "Designer Gold Bangles",
      image:
        "https://images.unsplash.com/photo-1679156271456-d6068c543ee7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlcyUyMGpld2VsbGVyeXxlbnwxfHx8fDE3NzQ1MzgyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Bangles",
    },
    {
      id: "5",
      name: "Pearl Gold Necklace",
      image:
        "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Necklaces",
    },
    {
      id: "6",
      name: "Bridal Ring Collection",
      image:
        "https://images.unsplash.com/photo-1708551413300-4ade9d984570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwcmluZ3MlMjBqZXdlbGxlcnl8ZW58MXx8fHwxNzc0NTM4MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Rings",
    },
  ];

  const categories = [
    { name: "Rings", count: 150, icon: "RG" },
    { name: "Necklaces", count: 200, icon: "NK" },
    { name: "Earrings", count: 180, icon: "ER" },
    { name: "Bangles", count: 120, icon: "BG" },
  ];

  const refreshIntervalMinutes = displayData.cache_ttl_minutes ?? 10;
  const cachedStatusMessage =
    displayData.source_status === "stale_cache"
      ? displayData.warning || "Showing the latest cached rates."
      : null;

  return (
    <div className="bg-white overflow-x-clip">
      <section className="relative bg-gradient-to-r from-yellow-50 to-yellow-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-12 left-6 sm:left-20 w-40 sm:w-64 h-40 sm:h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-0 sm:right-20 w-56 sm:w-96 h-56 sm:h-96 bg-yellow-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl text-gray-900 leading-tight max-w-xl">
                Timeless Elegance in Gold
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                Discover our exquisite collection of handcrafted gold jewellery,
                where tradition meets contemporary design.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-yellow-600 text-white rounded-lg shadow-sm hover:bg-yellow-700 transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/gold-rate"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Today&apos;s Gold Rate
                  <TrendingUp className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="order-last md:order-none">
              <div className="relative max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-[2rem] blur-2xl opacity-20"></div>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Featured jewellery"
                  className="relative w-full h-auto object-cover rounded-xl shadow-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-6 sm:-mt-10 mb-10 sm:mb-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-gray-900">Today&apos;s Gold Rate</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live data refreshed every {refreshIntervalMinutes} minutes</span>
              </div>
              <p className="text-xs text-gray-500">
                {loading
                  ? "Fetching the latest live rates..."
                  : `Last updated: ${formatLastUpdated(displayData.last_updated)}`}
              </p>
              {error && (
                <p className="text-xs text-red-600">
                  Live feed unavailable. Showing fallback rates.
                </p>
              )}
              {cachedStatusMessage && !error && (
                <p className="text-xs text-amber-700">{cachedStatusMessage}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-lg shadow-sm border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">22K Gold</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {loading ? "Loading..." : `Rs. ${formatRate(displayData.gold_22k)}`}
                </p>
                <p className="text-xs text-gray-500">per gram</p>
              </div>
              <div className="rounded-lg shadow-sm border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">24K Gold</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {loading ? "Loading..." : `Rs. ${formatRate(displayData.gold_24k)}`}
                </p>
                <p className="text-xs text-gray-500">per gram</p>
              </div>
              <div className="rounded-lg shadow-sm border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Silver</p>
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-900">
                  {loading ? "Loading..." : `Rs. ${formatRate(displayData.silver)}`}
                </p>
                <p className="text-xs text-gray-500">per gram</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Link
                to="/gold-rate"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 text-yellow-700 hover:text-yellow-800 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-gray-900 mb-4">Featured Collection</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked designs that showcase the perfect blend of craftsmanship and elegance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-sm text-yellow-600 mb-2">{product.category}</p>
                <h3 className="text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">View Details</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-base sm:text-xl text-gray-600">
              Explore our diverse range of jewellery collections
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm sm:text-base font-semibold">
                  {category.icon}
                </div>
                <h3 className="text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count}+ Designs</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
              <Award className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">BIS Certified</h3>
            <p className="text-sm text-gray-600">100% hallmarked gold jewellery</p>
          </div>
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
              <Shield className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Trust & Quality</h3>
            <p className="text-sm text-gray-600">30+ years of excellence</p>
          </div>
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
              <TrendingUp className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Fair Pricing</h3>
            <p className="text-sm text-gray-600">Transparent gold rates</p>
          </div>
          <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-full mb-4">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Lifetime Service</h3>
            <p className="text-sm text-gray-600">Free cleaning & maintenance</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-yellow-50 to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="About Sri Amman Jewellery"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-gray-900">Our Story</h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Since 1990, Sri Amman Jewellery has been a beacon of trust and
                quality in the world of gold and diamond jewellery. Our legacy
                is built on the foundation of authenticity, craftsmanship, and
                customer satisfaction.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every piece in our collection is carefully crafted by skilled
                artisans, combining traditional techniques with contemporary
                designs to create jewellery that is truly timeless.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Learn More About Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl shadow-sm p-6 sm:p-10 text-center text-white">
          <h2 className="mb-4">Visit Our Showroom</h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 text-yellow-50 max-w-2xl mx-auto">
            Experience our jewellery collection in person and let our experts
            guide you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Directions
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+919363161304"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
