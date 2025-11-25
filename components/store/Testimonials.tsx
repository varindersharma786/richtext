// components/store/Testimonials.tsx
"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Fashion Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    content: "Hands down the best shopping experience I've had online. The quality is insane and delivery was lightning fast!",
    rating: 5,
  },
  {
    name: "Arjun Mehta",
    role: "Tech Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    content: "Finally a store that gets it. Curated collections, no cheap knockoffs, and customer service actually responds. I'm obsessed.",
    rating: 5,
  },
  {
    name: "Ananya Patel",
    role: "Interior Designer",
    avatar: "https://images.unsplash.com/photo-1580489940927-794c02d93f36?w=400",
    content: "The home collection transformed my space. Every piece feels premium and unique. Will definitely order again!",
    rating: 5,
  },
  {
    name: "Rohan Kapoor",
    role: "Fitness Coach",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    content: "Packaging? 10/10. Speed? 10/10. Product quality? 10/10. You guys are killing it. Keep dropping these fire collections!",
    rating: 5,
  },
];

export default function Testimonials() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-purple-600 font-bold tracking-wider uppercase text-sm mb-4">
            Loved by Thousands
          </p>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Don't Take Our Word For It
          </h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-10 h-10 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-4 text-2xl font-semibold text-gray-700">
              4.9/5 from 12,847 reviews
            </span>
          </div>
        </motion.div>

        {/* Carousel */}
        <Carousel ref={emblaRef} className="overflow-hidden">
          <CarouselContent className="-ml-4">
            {testimonials.map((t, i) => (
              <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <div className="group relative bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {/* Quote Icon */}
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-purple-200 group-hover:text-purple-300 transition-colors" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 text-lg leading-relaxed flex-1 italic">
                      "{t.content}"
                    </p>

                    {/* Avatar + Info */}
                    <div className="flex items-center gap-5 mt-8">
                      <div className="relative">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-12 mt-20 text-gray-600"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <span className="font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <span className="font-medium">Free Returns</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <span className="font-medium">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}