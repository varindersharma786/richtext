"use client";

import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function Benefits() {
  const benefits = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over ₹999",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-900">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
