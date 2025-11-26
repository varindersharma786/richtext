"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function PromoBanner() {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gray-900 dark:bg-neutral-900 p-12 md:p-20 text-center md:text-left"
        >
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-semibold">
                  Limited Time Offer
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              >
                Get Up to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  50% Off
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg mb-10 max-w-lg mx-auto md:mx-0"
              >
                Don't miss out on our biggest sale of the season. Shop now and
                save big on your favorite products.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/products?sale=true">
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 h-14 px-8 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Shop Sale
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right Image/Graphic */}
            <motion.div
              initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative h-64 md:h-96 flex items-center justify-center"
            >
              <div className="relative z-10 text-[10rem] md:text-[12rem] drop-shadow-2xl animate-bounce-slow">
                🎁
              </div>

              {/* Decorative Circles */}
              <div className="absolute inset-0 border border-white/10 rounded-full scale-150 animate-spin-slow-reverse" />
              <div className="absolute inset-0 border border-white/5 rounded-full scale-[1.8] animate-spin-slow" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
