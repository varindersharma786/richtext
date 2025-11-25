// components/store/CheckoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CheckoutButton({ items }: { items: any[] }) {
  const { clearCart, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);

  const initiateCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          userId: "temp-user-id", // In real app: get from Supabase auth
        }),
      });

      const { orderId, amount } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency: "INR",
        name: "Your Store Name",
        description: "Thank you for shopping with us!",
        order_id: orderId,
        handler: async (response: any) => {
          // Verify payment on your backend (webhook will handle DB update)
          clearCart();
          toast.success( "Payment Successful!",{
       
            description: `Order ID: ${response.razorpay_order_id}`,
          });
          window.location.href = "/order-success";
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: { color: "#8b5cf6" },
      };

      // @ts-ignore - Razorpay is loaded globally
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Checkout failed", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{totalPrice().toLocaleString("en-IN")}</span>
      </div>

      <Button
        onClick={initiateCheckout}
        disabled={loading || items.length === 0}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Checkout with Razorpay
          </>
        )}
      </Button>
    </div>
  );
}