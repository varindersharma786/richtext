import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/dashboard");
  }

  // Fetch real statistics from database
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { data: orders } = await supabase
    .from("orders")
    .select("amount, status, created_at");

  const { data: products } = await supabase
    .from("products")
    .select("id", { count: "exact" });

  // Calculate revenue (only paid orders)
  const paidOrders = orders?.filter((o) => o.status === "paid") || [];
  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + (order.amount || 0),
    0
  );

  // Calculate recent revenue change (last 30 days vs previous 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const recentRevenue = paidOrders
    .filter((o) => new Date(o.created_at) > thirtyDaysAgo)
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  const previousRevenue = paidOrders
    .filter(
      (o) =>
        new Date(o.created_at) > sixtyDaysAgo &&
        new Date(o.created_at) <= thirtyDaysAgo
    )
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  const revenueChange =
    previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

  // Fetch recent orders with user details
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id,
      amount,
      created_at,
      status,
      profiles:user_id (
        full_name,
        email
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`,
      change:
        revenueChange >= 0
          ? `+${revenueChange.toFixed(1)}% from last month`
          : `${revenueChange.toFixed(1)}% from last month`,
      icon: DollarSign,
    },
    {
      title: "Total Users",
      value: `${totalUsers || 0}`,
      change: "Registered users",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: `${orders?.length || 0}`,
      change: `${paidOrders.length} completed`,
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: `${products?.length || 0}`,
      change: "Active products",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-muted-foreground">
          Overview of your store's performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-none shadow-sm bg-white dark:bg-neutral-900"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-taupe-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Chart Placeholder - Monthly Revenue Trend
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <p className="text-sm text-muted-foreground">
              {orders?.length || 0} total orders
            </p>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-8">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.profiles?.full_name || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.profiles?.email || "No email"}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +₹{order.amount?.toLocaleString("en-IN") || 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
