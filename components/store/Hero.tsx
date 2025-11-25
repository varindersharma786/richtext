// components/store/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Animated Background Orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        animate={{ x: [0, -150, 0], y: [0, 100, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"
      />

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
              Summer Collection 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Discover exclusive drops. Limited pieces. Be the first.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-lg px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition"
                >
                  <ShoppingBag className="mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-full"
              >
                <Sparkles className="mr-2" />
                View Highlights
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
