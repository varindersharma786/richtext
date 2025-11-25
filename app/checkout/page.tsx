"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CartSummary from "@/components/cart/CartSummary";
import PayPalButton from "@/components/checkout/PayPalButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const subtotal = totalPrice();
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p>Your cart is empty.</p>
        <Link href="/products">Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <Link
          href="/cart"
          className="inline-flex items-center text-muted-foreground hover:text-taupe-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-taupe-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-taupe-900">
                Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Summary */}
          <div className="space-y-8">
            <CartSummary />

            <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-6">
              <h2 className="text-xl font-semibold text-taupe-900">Payment</h2>
              <PayPalButton amount={total} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
