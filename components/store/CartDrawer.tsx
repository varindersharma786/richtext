// components/store/CartDrawer.tsx
"use client";

import { X, Trash2, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CheckoutButton } from "./CheckoutButton";
import PayPalProvider from "@/components/providers/PayPalProvider";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, isOpen, setIsOpen } =
    useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length})</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4 flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => {
              const imageUrl = item.image_urls?.[0] || item.image_url;
              return (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={imageUrl || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-auto pt-4 border-t">
          <PayPalProvider>
            <CheckoutButton items={items} />
          </PayPalProvider>
        </div>
      </SheetContent>
    </Sheet>
  );
}
