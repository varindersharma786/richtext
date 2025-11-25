"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

interface PayPalButtonProps {
  amount: number;
}

export default function PayPalButton({ amount }: PayPalButtonProps) {
  const { clearCart } = useCart();
  const router = useRouter();

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD", // PayPal often defaults to USD for testing, change to INR if account supports it
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "black",
          shape: "rect",
          label: "pay",
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: (amount / 84).toFixed(2), // Rough conversion to USD for demo purposes if INR not supported in sandbox
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            toast.success("Payment Successful", {
              description: `Transaction completed by ${details.payer?.name?.given_name}`,
            });
            clearCart();
            router.push("/dashboard/orders");
          }
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          toast.error("Payment Failed", {
            description: "Please try again.",
          });
        }}
      />
    </PayPalScriptProvider>
  );
}
