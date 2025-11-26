"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ShopTheLook() {
  return (
    <section className="py-24 bg-neutral-100 dark:bg-neutral-900">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left - Large Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden bg-gray-200"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              alt="Shop the Look"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Right - Content & Small Images */}
          <div className="flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-serif mb-6 text-gray-900 dark:text-white">
                Curated for Your Lifestyle
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg font-light leading-relaxed">
                Every piece is carefully selected to bring timeless elegance to
                your wardrobe. Discover collections that speak to your unique
                style.
              </p>
              <Link href="/products">
                <Button className="rounded-none bg-gray-900 text-white hover:bg-gray-800 px-8 h-12 uppercase tracking-widest text-xs">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>

            {/* Small Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="aspect-square overflow-hidden bg-gray-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2070&auto=format&fit=crop"
                  alt="Style 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-square overflow-hidden bg-gray-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop"
                  alt="Style 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
