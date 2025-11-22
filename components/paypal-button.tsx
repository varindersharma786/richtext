"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
  planId: string;
  onSuccess?: () => void;
}

export default function PayPalButton({ planId, onSuccess }: PayPalButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    vault: true,
    intent: "subscription",
  };

  return (
    <div className="w-full">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            color: "blue",
            layout: "vertical",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: planId,
            });
          }}
          onApprove={async (data, actions) => {
            try {
              // Verify the user is logged in
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) {
                throw new Error("User not authenticated");
              }

              // Call our API to record the subscription
              const response = await fetch("/api/webhooks/paypal", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  event_type: "PAYMENT.SALE.COMPLETED", // Simulating a webhook event for client-side simplicity in this demo
                  resource: {
                    billing_agreement_id: data.subscriptionID,
                    custom: user.id, // We should ideally pass user ID in custom field during createSubscription
                    plan_id: planId,
                  },
                  // In a real app, you'd rely on the actual webhook from PayPal
                  // This is a client-side fallback/simulation to update UI immediately
                  user_id: user.id,
                  subscription_id: data.subscriptionID,
                  plan_id: planId,
                }),
              });

              if (!response.ok) {
                throw new Error("Failed to record subscription");
              }

              if (onSuccess) onSuccess();
              router.refresh();
            } catch (err: any) {
              setError(err.message);
            }
          }}
          onError={(err) => {
            setError("PayPal Error: " + err);
            console.error("PayPal Error:", err);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
