import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = await createClient();

        // In a real production app, you MUST verify the PayPal webhook signature here.
        // For this demo/MVP, we are trusting the payload (which is insecure for production).

        const eventType = body.event_type;
        const resource = body.resource;

        console.log("PayPal Webhook Event:", eventType);

        if (eventType === "PAYMENT.SALE.COMPLETED" || eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
            // Handle subscription activation/payment
            const subscriptionId = resource.billing_agreement_id || resource.id;
            const planId = resource.plan_id;
            const userId = resource.custom || body.user_id; // We passed user_id in body for client-side simulation

            if (userId) {
                const { error } = await supabase.from("subscriptions").upsert({
                    user_id: userId,
                    paypal_subscription_id: subscriptionId,
                    plan_id: planId,
                    status: "active",
                    current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Approx 1 month, should come from PayPal
                }, { onConflict: 'paypal_subscription_id' });

                if (error) {
                    console.error("Error updating subscription:", error);
                    return NextResponse.json({ error: error.message }, { status: 500 });
                }
            }
        } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
            // Handle cancellation
            const subscriptionId = resource.id;

            const { error } = await supabase
                .from("subscriptions")
                .update({ status: "cancelled" })
                .eq("paypal_subscription_id", subscriptionId);

            if (error) {
                console.error("Error cancelling subscription:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
