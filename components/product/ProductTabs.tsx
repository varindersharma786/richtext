"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductTabs({ product }: { product: any }) {
  return (
    <Tabs defaultValue="description" className="mt-20">
      <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto h-14">
        <TabsTrigger value="description" className="text-lg">Description</TabsTrigger>
        <TabsTrigger value="reviews" className="text-lg">Reviews (428)</TabsTrigger>
        <TabsTrigger value="shipping" className="text-lg">Shipping</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-10 prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: product.description || "<p>No description available.</p>" }} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-10">
        <div className="text-center py-20 text-2xl text-gray-600">
          Real reviews coming soon! All 5 stars so far
        </div>
      </TabsContent>

      <TabsContent value="shipping" className="mt-10 text-center py-10">
        <p className="text-xl">Free express shipping on all orders above ₹999</p>
        <p className="text-gray-600 mt-4">Delivered in 2–4 business days • Track your order</p>
      </TabsContent>
    </Tabs>
  );
}