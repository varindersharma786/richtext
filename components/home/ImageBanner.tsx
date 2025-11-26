"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ImageBanner() {
  return (
    <section className="relative h-[60vh] overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Banner"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Limited Edition Collection
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Exclusive pieces crafted for the discerning individual
          </p>
          <Link href="/products">
            <Button className="rounded-none bg-white text-black hover:bg-gray-100 px-8 h-12 uppercase tracking-widest text-xs">
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
