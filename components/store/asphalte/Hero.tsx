// components/store/asphalte/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-neutral-900 text-white">
      {/* Background Image – Use a high-res lifestyle photo like Asphalte's urban menswear */}
      <Image
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=90" // Placeholder: Elegant man in suit
        alt="Timeless Essentials"
        fill
        className="object-cover"
        priority
      />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6">
          Timeless <span className="font-bold text-taupe-400">Essentials</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mb-12">
          Crafted for the modern man. Sustainable. Enduring. Yours.
        </p>
        <Link href="/products">
          <Button size="lg" variant="secondary" className="bg-transparent border-white/50 hover:bg-white/10 text-white px-12 py-6 text-lg rounded-full">
            Discover Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
      >
        <div className="w-1 h-8 bg-white/50 rounded-full" />
      </motion.div>
    </section>
  );
}