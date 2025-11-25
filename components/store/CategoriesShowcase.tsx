// components/store/CategoriesShowcase.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    gradient: "from-cyan-500 to-blue-600",
    count: "128 products",
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1441986300917-6467280960fa?w=800&q=80",
    gradient: "from-pink-500 to-rose-600",
    count: "342 products",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    image: "https://images.unsplash.com/photo-1618221195710-ddb4537a1e4e?w=800&q=80",
    gradient: "from-amber-500 to-orange-600",
    count: "89 products",
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1596462501599-8748af3cc2a8?w=800&q=80",
    gradient: "from-purple-500 to-indigo-600",
    count: "201 products",
  },
];

export default function CategoriesShowcase() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <p className="text-purple-600 font-semibold tracking-wider uppercase text-sm">
              Shop by Category
            </p>
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Explore Our World
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Discover curated collections designed for your lifestyle
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
            >
              <Link href={`/category/${category.slug}`} className="block h-full">
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-4xl font-bold mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-lg opacity-90 mb-4">{category.count}</p>
                    
                    <div className="flex items-center gap-3 text-white font-medium">
                      <span className="tracking-wider">Shop Now</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
                >
                  <span className="text-white font-semibold text-sm">
                    New Drop
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            Can't decide? Let us help you find the perfect match
          </p>
          <Link href="/products">
            <button className="bg-black text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-800 transition shadow-xl hover:shadow-2xl hover:scale-105">
              Browse All Products
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}