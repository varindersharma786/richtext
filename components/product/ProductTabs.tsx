"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Star, Truck } from "lucide-react";

export default function ProductTabs({ product }: { product: any }) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-14">
        <TabsTrigger value="description" className="text-base">
          <Package className="w-4 h-4 mr-2" />
          Description
        </TabsTrigger>
        <TabsTrigger value="reviews" className="text-base">
          <Star className="w-4 h-4 mr-2" />
          Reviews
        </TabsTrigger>
        <TabsTrigger value="shipping" className="text-base">
          <Truck className="w-4 h-4 mr-2" />
          Shipping
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-8">
        {product.description ? (
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-purple-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : (
          <p className="text-gray-500 text-center py-8">
            No description available for this product.
          </p>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="mt-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold">4.8</div>
            <div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on 428 reviews</p>
            </div>
          </div>
          <p className="text-gray-500 py-4">Customer reviews coming soon...</p>
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-8">
        <div className="space-y-4 text-gray-700">
          <div className="flex items-start gap-4">
            <Truck className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Free Delivery</h3>
              <p>
                Free standard delivery on orders above ₹999. Express delivery
                available for ₹99.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Package className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
              <p>
                30-day return policy. Items must be in original packaging and
                unused.
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
