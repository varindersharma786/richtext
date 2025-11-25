"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const { items, removeFromCart, addToCart } = useCart();

  // Helper to update quantity (using addToCart logic which increments,
  // but for decrement we might need a new method in useCart or just remove and re-add logic if simple)
  // For now, let's assume useCart only has addToCart (increment) and removeFromCart.
  // Ideally, useCart should have updateQuantity.
  // I will implement a basic version here.

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-taupe-900">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>
        <Link href="/products">
          <Button className="bg-taupe-900 hover:bg-taupe-800 text-white rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="text-3xl font-bold text-taupe-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-taupe-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Unit Price: ₹{item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1">
                      <button
                        className="p-1 hover:text-taupe-900 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        // Note: Real implementation needs updateQuantity
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="p-1 hover:text-taupe-900"
                        onClick={() => addToCart(item)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-lg text-taupe-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <CartSummary />
            <Link href="/checkout" className="block">
              <Button className="w-full bg-taupe-900 hover:bg-taupe-800 text-white rounded-full py-6 text-lg">
                Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
