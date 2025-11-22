"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PayPalButton from "@/components/paypal-button";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Basic",
      description: "Essential features for individuals.",
      priceMonthly: 9.99,
      priceYearly: 99.99,
      features: [
        "Access to all blog posts",
        "Comment on posts",
        "Basic support",
      ],
      paypalPlanIdMonthly:
        process.env.NEXT_PUBLIC_PAYPAL_PLAN_BASIC_MONTHLY || "P-BASIC-M",
      paypalPlanIdYearly:
        process.env.NEXT_PUBLIC_PAYPAL_PLAN_BASIC_YEARLY || "P-BASIC-Y",
    },
    {
      name: "Pro",
      description: "Advanced features for power users.",
      priceMonthly: 19.99,
      priceYearly: 199.99,
      features: [
        "Everything in Basic",
        "Exclusive content",
        "Priority support",
        "Ad-free experience",
      ],
      paypalPlanIdMonthly:
        process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY || "P-PRO-M",
      paypalPlanIdYearly:
        process.env.NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY || "P-PRO-Y",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose the plan that's right for you.
          </p>

          <div className="flex items-center justify-center mt-8 gap-4">
            <Label
              htmlFor="billing-mode"
              className={!isYearly ? "font-bold" : ""}
            >
              Monthly
            </Label>
            <Switch
              id="billing-mode"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label
              htmlFor="billing-mode"
              className={isYearly ? "font-bold" : ""}
            >
              Yearly{" "}
              <span className="text-xs text-green-600 font-normal">
                (Save ~20%)
              </span>
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;
            const planId = isYearly
              ? plan.paypalPlanIdYearly
              : plan.paypalPlanIdMonthly;
            const isSelected = selectedPlan === plan.name;

            return (
              <Card
                key={plan.name}
                className={`flex flex-col ${
                  plan.name === "Pro" ? "border-primary shadow-lg" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isSelected ? (
                    <PayPalButton
                      planId={planId}
                      onSuccess={() =>
                        alert(`Successfully subscribed to ${plan.name} plan!`)
                      }
                    />
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.name === "Pro" ? "default" : "outline"}
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      Choose {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
