
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

async function getUserOrders() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*, products(name, image_url))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { orders: data || [], user };
}

export default async function OrdersPage() {
  const { orders, user } = await getUserOrders();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600 mb-8">No orders yet</p>
            <Link href="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-bold">{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      order.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.products.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-bold">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t text-right">
                  <p className="text-2xl font-bold">Total: ₹{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}