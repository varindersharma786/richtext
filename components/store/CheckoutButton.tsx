// components/store/CheckoutButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export function CheckoutButton({ items }: { items: any[] }) {
  const { clearCart, totalPrice } = useCart();
  const [{ isPending }] = usePayPalScriptReducer();
  const [processing, setProcessing] = useState(false);
  const supabase = createClient();

  const createOrder = async () => {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
          })),
        }),
      });

      const order = await response.json();
      return order.id;
    } catch (error: any) {
      toast.error("Failed to create order");
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      setProcessing(true);

      // Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to complete your purchase");
        return;
      }

      // Save order to database
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          userId: user.id,
          paymentId: data.orderID,
          provider: "paypal",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      clearCart();
      toast.success("Payment successful!", {
        description: `Order ID: ${data.orderID}`,
      });

      window.location.href = "/order-success";
    } catch (error: any) {
      toast.error("Payment verification failed");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const onError = (err: any) => {
    toast.error("Payment failed", {
      description: "Please try again or use a different payment method",
    });
    console.error(err);
  };

  if (items.length === 0) {
    return (
      <div className="border-t pt-6">
        <Button disabled className="w-full h-14 text-lg">
          Cart is Empty
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{totalPrice().toLocaleString("en-IN")}</span>
      </div>

      {isPending || processing ? (
        <Button disabled className="w-full h-14 text-lg">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {processing ? "Processing..." : "Loading PayPal..."}
        </Button>
      ) : (
        <div className="space-y-3">
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "paypal",
            }}
          />
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            Secure payment powered by PayPal
          </div>
        </div>
      )}
    </div>
  );
}
