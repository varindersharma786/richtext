import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Heart, User, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch real orders data
  const { data: orders, count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Count pending orders
  const pendingOrders =
    orders?.filter(
      (order) => order.status === "pending" || order.status === "processing"
    ).length || 0;

  // Fetch wishlist count (assuming there's a wishlist table or saved items)
  // If no wishlist table exists, we'll show 0
  const { count: wishlistCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get recent orders (last 2)
  const recentOrders = orders?.slice(0, 2) || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          Welcome back, {profile?.full_name || "User"}!
        </h2>
        <p className="text-muted-foreground">
          Here's what's happening with your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/orders">
          <Card className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-none shadow-sm bg-white dark:bg-neutral-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-taupe-900 dark:text-white">
                {ordersCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders > 0
                  ? `${pendingOrders} pending delivery`
                  : "All delivered"}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/wishlist">
          <Card className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer border-none shadow-sm bg-white dark:bg-neutral-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Wishlist
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-taupe-900 dark:text-white">
                {wishlistCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Items saved</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Member Since
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-taupe-900 dark:text-white">
              {new Date(user.created_at).getFullYear()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-taupe-900 dark:text-white capitalize">
              {profile?.plan || "Free"}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.plan === "pro" ? "Active" : "Upgrade to Pro"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Placed on{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No orders yet</p>
                <Link
                  href="/products"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
