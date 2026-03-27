import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Award,
  MessageCircle,
  Phone,
  Shield,
  Weight,
} from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function ProductDetails() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = {
    id: id || "1",
    name: "Elegant Gold Chain",
    category: "Necklaces",
    weight: "15.5g",
    purity: "22K",
    hallmark: "BIS Certified",
    description:
      "An exquisite handcrafted gold chain featuring intricate traditional design elements. This piece represents the perfect blend of timeless elegance and contemporary styling. Crafted with precision by our master artisans, each link is carefully formed to create a stunning visual appeal.",
    features: [
      "BIS Hallmarked 22K Gold",
      "Handcrafted by expert artisans",
      "Comes with authenticity certificate",
      "Lifetime free cleaning & maintenance",
      "Exchange policy available",
    ],
    images: [
      "https://images.unsplash.com/photo-1662434923031-b9bf1b6c10e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1672646858147-2f9ddb140191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1642373174965-ef3793eabcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Pearl Gold Necklace",
      image:
        "https://images.unsplash.com/photo-1672646856394-ec0dd6a4ccec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "3",
      name: "Cross Pendant Necklace",
      image:
        "https://images.unsplash.com/photo-1612813411142-8eb444ff0dff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "4",
      name: "Traditional Gold Rings",
      image:
        "https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
              <ImageWithFallback
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === index
                      ? "border-yellow-600 shadow-sm"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <p className="text-sm text-yellow-600 mb-2">{product.category}</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4">
                {product.name}
              </h1>
            </div>

            <div className="bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6 space-y-4 border border-gray-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Weight className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Weight</span>
                </div>
                <span className="text-gray-900">{product.weight}</span>
              </div>

              <div className="h-px bg-gray-200"></div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Purity</span>
                </div>
                <span className="text-gray-900">{product.purity}</span>
              </div>

              <div className="h-px bg-gray-200"></div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Hallmark</span>
                </div>
                <span className="text-gray-900">{product.hallmark}</span>
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4 sm:pt-6">
              <a
                href="https://wa.me/919363161304"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire on WhatsApp
              </a>

              <a
                href="tel:+919363161304"
                className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors shadow-sm"
              >
                <Phone className="w-5 h-5" />
                Call to Enquire
              </a>

              <Link
                to="/contact"
                className="flex items-center justify-center gap-3 w-full px-5 py-3 bg-white text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Visit Showroom
              </Link>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Final price will be calculated based on
                current gold rate + making charges. Contact us for accurate pricing.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-gray-900 mb-6 sm:mb-8">You May Also Like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {relatedProducts.map((related) => (
              <Link
                key={related.id}
                to={`/products/${related.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={related.image}
                    alt={related.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">View Details</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
