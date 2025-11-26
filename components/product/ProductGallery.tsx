"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductGallery({
  images,
}: {
  images: (string | null)[];
}) {
  const validImages = images.filter(
    (img): img is string => img !== null && img !== undefined
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelected((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
      } else if (e.key === "ArrowRight") {
        setSelected((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validImages.length]);

  const handlePrevious = () => {
    setSelected((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    setSelected((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl group">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Zoom>
              <Image
                src={validImages[selected]}
                alt={`Product image ${selected + 1}`}
                fill
                className="object-cover cursor-zoom-in"
                priority={selected === 0}
              />
            </Zoom>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur">
            {selected + 1} / {validImages.length}
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-6 left-6">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            New Arrival
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all hover:scale-105 ${
                selected === i
                  ? "border-purple-600 shadow-lg ring-2 ring-purple-600 ring-offset-2"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
