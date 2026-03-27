import {
  Award,
  Clock,
  Heart,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality Assurance",
      description:
        "Every piece is BIS hallmarked and comes with authenticity certification, ensuring 100% purity.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Craftsmanship",
      description:
        "Our master artisans bring decades of experience, blending traditional techniques with modern designs.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description:
        "Building lasting relationships through trust, transparency, and personalized service.",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Fair Pricing",
      description:
        "Transparent pricing with daily updated gold rates and competitive making charges.",
    },
  ];

  const milestones = [
    {
      year: "1990",
      title: "Foundation",
      description:
        "Sri Amman Jewellery was founded with a vision to provide authentic gold jewellery.",
    },
    {
      year: "2000",
      title: "Expansion",
      description:
        "Opened our flagship showroom and expanded our collection to include diamonds.",
    },
    {
      year: "2015",
      title: "Recognition",
      description:
        "Awarded 'Most Trusted Jeweller' by the regional trade association.",
    },
    {
      year: "2026",
      title: "Today",
      description:
        "Serving thousands of satisfied customers with 500+ unique designs.",
    },
  ];

  return (
    <div className="bg-white overflow-x-clip">
      <section className="relative bg-gradient-to-r from-yellow-50 to-yellow-100 overflow-hidden py-10 sm:py-16 lg:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-4 sm:left-20 w-40 sm:w-64 h-40 sm:h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 sm:right-20 w-56 sm:w-96 h-56 sm:h-96 bg-yellow-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl text-gray-900 mb-4 sm:mb-6">
              Our Story
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              Over three decades of excellence in crafting timeless jewellery
              that celebrates life&apos;s precious moments.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-gray-900">A Legacy of Trust</h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 1990, Sri Amman Jewellery began as a small family business
                with a simple yet powerful mission: to provide authentic, high-quality
                gold jewellery that our customers could trust for generations.
              </p>
              <p>
                What started with a modest collection has grown into a comprehensive
                showcase of over 500 unique designs, each piece crafted with meticulous
                attention to detail by our skilled artisans. Our journey has been guided
                by the values of integrity, craftsmanship, and customer satisfaction.
              </p>
              <p>
                Today, we stand proud as one of the most trusted jewellers in the region,
                serving thousands of satisfied customers who have made us part of their
                most cherished celebrations, from weddings to anniversaries, and every
                special moment in between.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-[2rem] blur-2xl opacity-20"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1708251079562-313ec8005354?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxnb2xkJTIwamV3ZWxsZXJ5JTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0NTM4MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Sri Amman Jewellery Showroom"
              className="relative w-full h-auto sm:h-[28rem] object-cover rounded-xl shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600 mb-4 sm:mb-6">
                  {value.icon}
                </div>
                <h3 className="text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-gray-900 mb-4">Our Journey</h2>
          <p className="text-base sm:text-xl text-gray-600">Key milestones in our story</p>
        </div>

        <div className="relative">
          <div className="lg:hidden absolute left-3 top-0 bottom-0 w-px bg-yellow-200"></div>
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-yellow-400 to-yellow-600"></div>

          <div className="space-y-5 sm:space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="relative grid lg:grid-cols-2 gap-4 sm:gap-8 items-center"
              >
                <div
                  className={`relative pl-10 lg:pl-0 ${
                    index % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:col-start-2 lg:pl-12"
                  }`}
                >
                  <div className="absolute left-0 top-6 w-6 h-6 bg-yellow-600 rounded-full border-4 border-white shadow-sm lg:hidden"></div>
                  <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-gray-200">
                    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg mb-4">
                      {milestone.year}
                    </span>
                    <h3 className="text-gray-900 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className={`hidden lg:block ${index % 2 === 0 ? "lg:col-start-2" : ""}`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-yellow-50 to-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center bg-white/80 rounded-lg shadow-sm border border-yellow-100 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full mb-4 sm:mb-6">
                <Shield className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-gray-900 mb-2">30+ Years</h3>
              <p className="text-gray-600">Of trusted service</p>
            </div>

            <div className="text-center bg-white/80 rounded-lg shadow-sm border border-yellow-100 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full mb-4 sm:mb-6">
                <Users className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Happy customers</p>
            </div>

            <div className="text-center bg-white/80 rounded-lg shadow-sm border border-yellow-100 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full mb-4 sm:mb-6">
                <Award className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">BIS Certified Gold</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-gray-900 mb-4">Why Choose Sri Amman Jewellery</h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re committed to making your jewellery shopping experience memorable
            and trustworthy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex gap-4 rounded-lg bg-gray-50 border border-gray-200 p-5 sm:p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Authenticity Guaranteed</h3>
              <p className="text-gray-600">
                Every piece comes with BIS hallmarking and authenticity certificates,
                ensuring you get exactly what you pay for.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-lg bg-gray-50 border border-gray-200 p-5 sm:p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                Daily updated gold rates and clear breakdown of making charges with
                no hidden costs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-lg bg-gray-50 border border-gray-200 p-5 sm:p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Lifetime Services</h3>
              <p className="text-gray-600">
                Free cleaning, polishing, and maintenance for all jewellery purchased
                from us.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-lg bg-gray-50 border border-gray-200 p-5 sm:p-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 mb-2">Customization Available</h3>
              <p className="text-gray-600">
                Work with our designers to create bespoke pieces that match your
                unique vision and style.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
