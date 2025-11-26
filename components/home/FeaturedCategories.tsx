"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
}

export default function FeaturedCategories({
  categories,
}: {
  categories: Category[];
}) {
  const featured = categories.slice(0, 3); // Show 3 for a nice grid

  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 dark:text-white">
            Curated Collections
          </h2>
          <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {featured.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-neutral-900"
              >
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <span className="text-4xl">📦</span>
                  </div>
                )}

                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />

                <div className="absolute bottom-8 left-0 w-full text-center text-white p-4">
                  <h3 className="text-2xl font-serif mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {category.name}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white pb-1">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/categories">
            <Button
              variant="outline"
              className="rounded-none border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 h-12 uppercase tracking-widest text-xs"
            >
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
