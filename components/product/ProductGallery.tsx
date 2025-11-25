"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import  Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ProductGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-6">
      {/* Main Image with Zoom */}
      <motion.div
        key={selected}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl"
      >
        <Zoom>
          <Image
            src={images[selected] || "/placeholder.jpg"}
            alt="Product"
            fill
            className="object-cover cursor-zoom-in"
          />
        </Zoom>

        {/* Badges */}
        <div className="absolute top-6 left-6 space-y-3">
          <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            Limited Edition
          </span>
          {images.length > 1 && (
            <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur">
              {images.length} photos
            </span>
          )}
        </div>
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all ${
                selected === i ? "border-purple-600 shadow-xl" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}