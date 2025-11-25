// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { razorpay } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  const { items, userId } = await req.json();
  const supabase = await createClient();

  // Verify user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const order = await razorpay.orders.create({
    amount: totalAmount * 100, // paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });

  // Save order in DB
  const { data: dbOrder } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount: totalAmount,
    })
    .select()
    .single();

  // Save order items
  await supabase.from('order_items').insert(
    items.map((item: any) => ({
      order_id: dbOrder.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))
  );

  return NextResponse.json({ orderId: order.id, amount: order.amount });
}