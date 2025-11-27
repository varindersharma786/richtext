"use client";

import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Banknote,
  ShoppingBag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const subtotal = totalPrice();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate costs
  const shippingCosts = {
    standard: subtotal > 999 ? 0 : 99,
    express: 199,
    overnight: 399,
  };
  const shipping = shippingCosts[shippingMethod as keyof typeof shippingCosts];
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Order placed successfully!");
    clearCart();
    router.push("/order-confirmation");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products before proceeding to checkout
          </p>
          <Link href="/products">
            <Button className="bg-gray-900 hover:bg-gray-800">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      placeholder="Street address"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      placeholder="Apartment, suite, etc. (optional)"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Mumbai"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postal">Postal Code *</Label>
                      <Input
                        id="postal"
                        placeholder="400001"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        placeholder="Maharashtra"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="India"
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox
                    id="billingSame"
                    checked={billingSameAsShipping}
                    onCheckedChange={(checked) =>
                      setBillingSameAsShipping(checked as boolean)
                    }
                  />
                  <Label htmlFor="billingSame" className="cursor-pointer">
                    Billing address same as shipping
                  </Label>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Shipping Method
                </h2>
                <RadioGroup
                  value={shippingMethod}
                  onValueChange={setShippingMethod}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:border-gray-400">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label
                          htmlFor="standard"
                          className="cursor-pointer font-normal"
                        >
                          <div className="font-semibold">Standard Shipping</div>
                          <div className="text-sm text-gray-500">
                            3-5 business days
                          </div>
                        </Label>
                      </div>
                      <span className="font-semibold">
                        {subtotal > 999 ? "FREE" : "₹99"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:border-gray-400">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label
                          htmlFor="express"
                          className="cursor-pointer font-normal"
                        >
                          <div className="font-semibold">Express Shipping</div>
                          <div className="text-sm text-gray-500">
                            1-2 business days
                          </div>
                        </Label>
                      </div>
                      <span className="font-semibold">₹199</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer hover:border-gray-400">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label
                          htmlFor="overnight"
                          className="cursor-pointer font-normal"
                        >
                          <div className="font-semibold">Overnight</div>
                          <div className="text-sm text-gray-500">Next day</div>
                        </Label>
                      </div>
                      <span className="font-semibold">₹399</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="space-y-3">
                    <div className="border-2 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label
                          htmlFor="card"
                          className="cursor-pointer flex items-center gap-2 font-normal"
                        >
                          <CreditCard className="w-5 h-5" />
                          <span className="font-semibold">
                            Credit/Debit Card
                          </span>
                        </Label>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="mt-4 space-y-4 pl-8">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                maxLength={3}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label
                        htmlFor="paypal"
                        className="cursor-pointer flex items-center gap-2 font-normal"
                      >
                        <Wallet className="w-5 h-5" />
                        <span className="font-semibold">PayPal</span>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label
                        htmlFor="cod"
                        className="cursor-pointer flex items-center gap-2 font-normal"
                      >
                        <Banknote className="w-5 h-5" />
                        <span className="font-semibold">Cash on Delivery</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Products */}
                <div className="space-y-3 mb-6 max-h-64 overflow-auto">
                  {items.map((item) => {
                    const imageUrl = item.image_urls?.[0] || item.image_url;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 py-4 border-t border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (18%)</span>
                    <span className="font-medium">
                      ₹
                      {tax.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4">
                  <span>Total</span>
                  <span>
                    ₹
                    {total.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gray-900 hover:bg-gray-800 h-12 text-base mt-6"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our{" "}
                  <Link href="/terms" className="underline">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
