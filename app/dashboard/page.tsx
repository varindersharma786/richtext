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
                12
              </div>
              <p className="text-xs text-muted-foreground">
                2 pending delivery
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
                5
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
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-neutral-800/50 border-gray-100 dark:border-neutral-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Order #ORD-2023-{100 + i}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on Oct {20 + i}, 2023
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹2,499.00</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Delivered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
