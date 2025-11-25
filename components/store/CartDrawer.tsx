// components/store/CartDrawer.tsx
"use client";

import { X, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { CheckoutButton } from "./CheckoutButton";

export default function CartDrawer() {
  const { items, removeFromCart, isOpen, setIsOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart ({items.length})</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4">
              <img
                src={item.image_url ?? undefined}
                alt=""
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <button onClick={() => removeFromCart(item.id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <CheckoutButton items={items} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
