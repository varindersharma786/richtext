// app/products/page.tsx

import FiltersSidebar from "@/components/store/FiltersSidebar";
import MobileFilters from "@/components/store/MobileFilters";
import ProductCard from "@/components/store/ProductCard";
import { createClient } from "@/utils/supabase/client";
import { Suspense } from "react";

const supabase = createClient();

async function getAllProducts() {
  const { data } = await supabase
    .from("products")
    .select("id, name, price, image_url, stock, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
console.log(data,"this is data");
  return data || [];
}

export default async function ProductsPage() {
  const products = await getAllProducts();
console.log(products,"this is products");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-purple-300">
            All Products
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            {products.length} premium items • New drops weekly
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Suspense fallback={<div>Loading filters...</div>}>
              <FiltersSidebar products={products} />
            </Suspense>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Trigger */}
            <div className="lg:hidden mb-6">
              <MobileFilters products={products} />
            </div>

            {/* Sort & Count */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">
                Showing <span className="font-bold">{products.length}</span> products
              </p>
              <select className="px-6 py-3 rounded-xl border bg-white shadow-sm">
                <option>Latest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
              </select>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More (optional) */}
            <div className="text-center mt-16">
              <button className="px-12 py-5 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition text-lg">
                Load More Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}