"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop",
    title: "The New Collection",
    subtitle: "Timeless essentials for the modern wardrobe.",
    cta: "Shop Now",
    link: "/products",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1920&auto=format&fit=crop",
    title: "Summer Breeze",
    subtitle: "Lightweight fabrics for warmer days.",
    cta: "Discover",
    link: "/products?category=summer",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
    title: "Premium Denim",
    subtitle: "Crafted to last a lifetime.",
    cta: "Explore Denim",
    link: "/products?category=denim",
  },
];

export default function HeroCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="relative h-screen overflow-hidden bg-neutral-900">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {SLIDES.map((slide) => (
            <div
              className="embla__slide relative flex-[0_0_100%] h-full min-w-0"
              key={slide.id}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover opacity-80"
                priority
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h2 className="text-xl md:text-2xl font-medium mb-4 tracking-widest uppercase text-taupe-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {slide.subtitle}
                  </h2>
                  <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    {slide.title}
                  </h1>
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <Link href={slide.link}>
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-taupe-100 hover:text-black rounded-full px-8 py-6 text-lg font-medium transition-all duration-300"
                      >
                        {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
