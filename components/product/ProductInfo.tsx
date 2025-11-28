"use client";

import { useState } from "react";
import { Star, Truck, Shield, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VariantSelector from "@/components/product/VariantSelector";
import { ProductVariant } from "@/types/product-variant";

export default function ProductInfo({
  product,
  variants = [],
}: {
  product: any;
  variants?: ProductVariant[];
}) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  const displayPrice = selectedVariant
    ? product.price + selectedVariant.price_adjustment
    : product.price;

  const displayStock = selectedVariant ? selectedVariant.stock : product.stock;

  const isOutOfStock = displayStock <= 0;

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    const cartItem = {
      ...product,
      variant_id: selectedVariant?.id || null,
      variant_name: selectedVariant?.variant_name || null,
      price: displayPrice,
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(cartItem);
    }

    const variantText = selectedVariant
      ? ` (${selectedVariant.variant_name})`
      : "";
    toast.success(`Added ${quantity} × ${product.name}${variantText} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="text-gray-600">(428 reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-5xl font-bold text-purple-600">
          ₹{Number(displayPrice).toLocaleString("en-IN")}
        </div>
        <p className="text-gray-600">Inclusive of all taxes</p>
        {displayStock < 10 && displayStock > 0 && (
          <p className="text-orange-600 font-medium">
            Only {displayStock} left in stock!
          </p>
        )}
        {isOutOfStock && <p className="text-red-600 font-bold">Out of Stock</p>}
      </div>

      {/* Variant Selector */}
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          basePrice={product.price}
          onVariantChange={setSelectedVariant}
        />
      )}

      <div className="flex gap-4">
        <Button
          onClick={handleAddToCart}
          size="lg"
          disabled={isOutOfStock || (variants.length > 0 && !selectedVariant)}
          className="flex-1 h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl disabled:opacity-50"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="outline" className="h-16 w-16">
          <Heart className="w-7 h-7" />
        </Button>
        <Button size="lg" variant="outline" className="h-16 w-16">
          <Share2 className="w-7 h-7" />
        </Button>
      </div>

      {/* Trust Icons */}
      <div className="grid grid-cols-3 gap-6 py-8 border-t border-b">
        <div className="flex items-center gap-3">
          <Truck className="w-10 h-10 text-purple-600" />
          <div>
            <p className="font-semibold">Free Delivery</p>
            <p className="text-sm text-gray-600">On orders above ₹999</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="w-10 h-10 text-purple-600" />
          <div>
            <p className="font-semibold">100% Authentic</p>
            <p className="text-sm text-gray-600">Guaranteed</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">30</span>
          </div>
          <div>
            <p className="font-semibold">Easy Returns</p>
            <p className="text-sm text-gray-600">Within 30 days</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
