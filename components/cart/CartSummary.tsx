"use client";

import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";

export default function CartSummary() {
  const { totalPrice } = useCart();
  const subtotal = totalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  return (
    <div className="bg-gray-50 dark:bg-neutral-900 p-6 rounded-xl space-y-4">
      <h3 className="font-semibold text-lg text-taupe-900 dark:text-white">
        Order Summary
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? "Free" : `₹${shipping.toLocaleString("en-IN")}`}
          </span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-lg text-taupe-900 dark:text-white">
        <span>Total</span>
        <span>₹{total.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
