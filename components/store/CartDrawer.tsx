// components/store/CartDrawer.tsx
"use client";

import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    isOpen,
    setIsOpen,
    totalPrice,
  } = useCart();

  const total = totalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-2xl font-bold">
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some products to get started
              </p>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {items.map((item, index) => {
                  const imageUrl = item.image_urls?.[0] || item.image_url;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t bg-gray-50 px-6 py-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-700">Subtotal</span>
              <span className="font-bold text-gray-900">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 h-12 text-base">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base border-2"
                >
                  View Full Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
