// components/store/asphalte/ProductGrid.tsx
"use client";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import ProductCardAsphalte from "./ProductCardAsphalte";

const supabase = createClient();

async function getFeaturedProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return data || [];
}

export default async function ProductGrid() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-24 px-6 bg-off-white">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-light mb-4">New Arrivals</h2>
          <p className="text-lg text-gray-600">Timeless pieces, reimagined.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCardAsphalte product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="/products" className="text-taupe-600 font-medium hover:underline">
            View All →
          </a>
        </div>
      </div>
    </section>
  );
}