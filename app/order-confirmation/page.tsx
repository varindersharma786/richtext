import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase. We've received your order.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8 text-left">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number</span>
              <span className="font-semibold text-gray-900">
                #ORD-{Math.random().toString().slice(2, 10)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold textgray-900">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="font-semibold text-gray-900">
                {new Date(
                  Date.now() + 5 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-bold text-gray-900 mb-4">What's Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>We'll notify you when your order ships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>You can track your order status anytime</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="bg-gray-900 hover:bg-gray-800 h-12 px-8">
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="h-12 px-8 border-2">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
