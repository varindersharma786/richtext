"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ProductVariant } from "@/types/product-variant";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  basePrice: number;
  onVariantChange: (variant: ProductVariant | null) => void;
}

export default function VariantSelector({
  variants,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    onVariantChange(variant);
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Select Variant</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id;
            const finalPrice = basePrice + variant.price_adjustment;
            const isOutOfStock = variant.stock <= 0;

            return (
              <button
                key={variant.id}
                onClick={() => !isOutOfStock && handleSelectVariant(variant)}
                disabled={isOutOfStock}
                className={cn(
                  "relative border-2 rounded-lg p-4 text-left transition-all",
                  "hover:border-purple-400 hover:shadow-md",
                  isSelected &&
                    "border-purple-600 bg-purple-50 ring-2 ring-purple-200",
                  isOutOfStock && "opacity-50 cursor-not-allowed bg-gray-100",
                  !isSelected && !isOutOfStock && "border-gray-200"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-5 w-5 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="font-medium text-sm mb-1">
                  {variant.variant_name}
                </div>
                <div className="text-xs text-gray-600">
                  ₹{finalPrice.toLocaleString("en-IN")}
                </div>
                {variant.price_adjustment !== 0 && (
                  <div className="text-xs text-purple-600 mt-1">
                    {variant.price_adjustment > 0 ? "+" : ""}₹
                    {variant.price_adjustment.toLocaleString("en-IN")}
                  </div>
                )}
                {isOutOfStock && (
                  <div className="text-xs text-red-600 font-medium mt-1">
                    Out of Stock
                  </div>
                )}
                {!isOutOfStock && variant.stock < 5 && (
                  <div className="text-xs text-orange-600 mt-1">
                    Only {variant.stock} left
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
