import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { items, userId, paymentId, provider = "paypal" } = await req.json();
  const supabase = await createClient();

  // Verify user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const totalAmount = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  // Save order in DB
  const { data: dbOrder, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      payment_provider: provider,
      payment_id: paymentId, // PayPal Order ID
      amount: totalAmount,
      status: "paid", // Assuming this is called after successful payment
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Save order items
  await supabase.from("order_items").insert(
    items.map((item: any) => ({
      order_id: dbOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  return NextResponse.json({ orderId: dbOrder.id, success: true });
}