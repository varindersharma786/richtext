"use client";

import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  const subtotal = totalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/products">
              <Button className="bg-gray-900 hover:bg-gray-800 h-12 px-8">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({items.length}{" "}
            {items.length === 1 ? "item" : "items"})
          </h1>
          <Link href="/products">
            <Button variant="outline" className="border-2">
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const imageUrl = item.image_urls?.[0] || item.image_url;
              const itemTotal = item.price * item.quantity;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Price: ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors h-fit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toLocaleString("en-IN")}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span className="font-medium">
                    ₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-xl">
                      ₹
                      {total.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {subtotal < 999 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Add{" "}
                    <span className="font-semibold text-gray-900">
                      ₹{(999 - subtotal).toLocaleString("en-IN")}
                    </span>{" "}
                    more to get{" "}
                    <span className="font-semibold text-green-600">
                      FREE shipping
                    </span>
                  </p>
                </div>
              )}

              <Link href="/checkout">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 h-12 text-base mb-3">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/products">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-2"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
