import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default async function SubscriptionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user?.id)
    .eq("status", "active")
    .single();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-muted-foreground">
          Manage your plan and billing details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your active subscription details.
              </CardDescription>
            </div>
            {profile?.plan && profile.plan !== "free" ? (
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            ) : (
              <Badge variant="secondary">Free Plan</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.plan && profile.plan !== "free" ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <span className="font-semibold capitalize text-lg">
                  {profile.plan} Plan
                </span>
              </div>
              {subscription && (
                <div className="text-sm text-muted-foreground">
                  <p>
                    PayPal Subscription ID:{" "}
                    {subscription.paypal_subscription_id}
                  </p>
                  <p>
                    Renews on:{" "}
                    {new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <XCircle className="h-5 w-5" />
              <span>
                You are currently on the free plan. Upgrade to unlock more
                features.
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          {subscription ? (
            <Button variant="destructive" asChild>
              <Link
                href="https://www.paypal.com/myaccount/autopay/"
                target="_blank"
              >
                Cancel Subscription (via PayPal)
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
