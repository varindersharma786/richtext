// app/api/send-receipt/route.ts
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { ReceiptEmail } from "@/emails/ReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { order, user } = await req.json();

  try {
    await resend.emails.send({
      from: "ShopFlow <receipt@yourdomain.com>",
      to: user.email,
      subject: `Order Confirmed #${order.id.slice(0, 8)}`,
      react: ReceiptEmail({ order, user }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}