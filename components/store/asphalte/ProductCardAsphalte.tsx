"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export default function ProductCardAsphalte({ product }: { product: any }) {
  const { addToCart } = useCart();

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white dark:bg-neutral-900">
        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="py-4">
          <h3 className="text-sm font-light text-gray-900 dark:text-white mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
}
