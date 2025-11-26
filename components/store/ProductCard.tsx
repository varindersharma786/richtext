// components/store/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  // Get first image from image_urls or fallback to image_url
  const imageUrl =
    product.image_urls?.[0] || product.image_url || "/placeholder.jpg";

  return (
    <motion.div
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl backdrop-blur-xl border border-white/20">
        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition bg-white/80 backdrop-blur p-3 rounded-full shadow-lg hover:scale-110">
          <Heart className="w-5 h-5 text-gray-700" />
        </button>

        <Link href={`/product/${product.id}`}>
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {product.stock < 10 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Only {product.stock} left!
              </div>
            )}
          </div>
        </Link>

        <div className="p-6">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-purple-600">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
            <Button
              onClick={() => addToCart(product)}
              size="sm"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
