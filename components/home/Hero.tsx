"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-neutral-900">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" /> {/* Overlay */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h2 className="text-sm md:text-base font-medium tracking-[0.2em] text-white uppercase mb-6">
            New Collection 2025
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8 leading-tight">
            The Art of <br />
            <span className="italic">Simplicity</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Discover our latest arrivals designed for the modern minimalist.
            Timeless pieces that define your style.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 rounded-none h-14 px-10 text-sm uppercase tracking-widest font-medium transition-all duration-300"
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black rounded-none h-14 px-10 text-sm uppercase tracking-widest font-medium transition-all duration-300 bg-transparent"
              >
                Read Our Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
