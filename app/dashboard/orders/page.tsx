import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function UserOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Mock orders
  const orders = [
    {
      id: "ORD-2023-101",
      date: "Oct 21, 2023",
      total: "₹2,499.00",
      status: "Delivered",
      items: ["Asphalte T-Shirt", "Denim Jeans"],
    },
    {
      id: "ORD-2023-102",
      date: "Oct 22, 2023",
      total: "₹1,299.00",
      status: "Processing",
      items: ["Cotton Hoodie"],
    },
    {
      id: "ORD-2023-103",
      date: "Oct 25, 2023",
      total: "₹5,999.00",
      status: "Pending",
      items: ["Leather Jacket"],
    },
  ];

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
                  <p className="font-medium">{order.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{order.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order #</p>
                  <p className="font-medium">{order.id}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Invoice
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg mb-1">{order.status}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.items.join(", ")}
                    </p>
                  </div>
                </div>
                <Button className="bg-taupe-900 hover:bg-taupe-800 text-white">
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
