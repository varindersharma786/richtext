// components/store/asphalte/ProductCardAsphalte.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react"; // For sustainable badge
import { useCart } from "@/hooks/use-cart";

export default function ProductCardAsphalte({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
      >
        <div className="relative h-80 bg-gray-50">
          <Image
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Sustainable Badge */}
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Eco
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-light text-lg mb-2">{product.name}</h3>
          <p className="text-2xl font-semibold text-taupe-600">₹{Number(product.price).toLocaleString("en-IN")}</p>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="mt-4 text-sm text-gray-500 hover:text-taupe-600"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </Link>
  );
}