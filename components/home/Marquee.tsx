"use client";

import { motion } from "framer-motion";

export default function Marquee() {
  const text =
    "FREE SHIPPING ON ALL ORDERS OVER ₹999 • NEW ARRIVALS JUST LANDED • 30-DAY EASY RETURNS • ";

  return (
    <div className="bg-neutral-900 text-white py-4 overflow-hidden border-y border-neutral-800">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex gap-4"
        >
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="text-sm font-medium tracking-[0.2em] uppercase"
            >
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
