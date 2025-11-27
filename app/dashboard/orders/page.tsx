import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UserOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch real orders from database
  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        quantity,
        price,
        product_id,
        products (
          name,
          image_url
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          My Orders
        </h2>
        <p className="text-muted-foreground">
          Track and manage your recent orders.
        </p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="border-none shadow-sm bg-white dark:bg-neutral-900 overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between bg-gray-50 dark:bg-neutral-800/50 py-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order Placed</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-medium">
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order #</p>
                    <p className="font-medium">
                      {order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/order/${order.id}`}>View Details</Link>
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {order.order_items?.[0]?.products?.image_url ? (
                        <img
                          src={order.order_items[0].products.image_url}
                          alt="Order item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1 capitalize">
                        {order.status}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {order.order_items?.length || 0} item(s)
                        {order.order_items?.[0]?.products?.name &&
                          ` - ${order.order_items[0].products.name}${order.order_items.length > 1 ? ` and ${order.order_items.length - 1} more` : ""}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "delivered" ? (
                      <Button variant="outline" size="sm">
                        Buy Again
                      </Button>
                    ) : order.status === "pending" ||
                      order.status === "processing" ? (
                      <Button
                        className="bg-taupe-900 hover:bg-taupe-800 text-white"
                        size="sm"
                      >
                        Track Order
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet
            </p>
            <Button
              asChild
              className="bg-taupe-900 hover:bg-taupe-800 text-white"
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
