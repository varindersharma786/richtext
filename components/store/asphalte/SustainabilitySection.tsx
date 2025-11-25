// components/store/asphalte/SustainabilitySection.tsx
"use client";
import { motion } from "framer-motion";
import { Leaf, Recycle, Globe } from "lucide-react";

const stats = [
  { icon: Leaf, label: "Sustainable Materials", value: "100%" },
  { icon: Recycle, label: "Recycled Packaging", value: "Zero Waste" },
  { icon: Globe, label: "Carbon Neutral", value: "Since 2015" },
];

export default function SustainabilitySection() {
  return (
    <section className="py-24 px-6 bg-taupe-50">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-4xl font-light mb-8"
        >
          Built to Last
        </motion.h2>
        <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
          Every piece is designed with the planet in mind. Timeless quality meets ethical production.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="space-y-4"
              >
                <Icon className="w-12 h-12 text-green-600 mx-auto" />
                <div className="font-bold text-3xl text-taupe-700">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}