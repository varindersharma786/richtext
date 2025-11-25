"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCardAsphalte from "@/components/store/asphalte/ProductCardAsphalte";

interface ProductCarouselProps {
  products: any[];
  title?: string;
}

export default function ProductCarousel({
  products,
  title,
}: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 2 },
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          {title && (
            <h2 className="text-3xl font-bold text-taupe-900">{title}</h2>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="embla overflow-hidden -mx-4 px-4" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {products.map((product) => (
              <div
                className="embla__slide flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
                key={product.id}
              >
                <ProductCardAsphalte product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
