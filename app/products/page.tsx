import FiltersSidebar from "@/components/store/FiltersSidebar";
import MobileFilters from "@/components/store/MobileFilters";
import ProductGrid from "@/components/product/ProductGrid";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, image_url, stock, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative bg-taupe-900 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            All Products
          </h1>
          <p className="text-xl text-taupe-100 max-w-2xl mx-auto font-light">
            Explore our latest collection of premium essentials.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 max-w-7xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Desktop Filters */}
          <div className="hidden lg:block sticky top-24 h-fit">
            <Suspense fallback={<div>Loading filters...</div>}>
              <FiltersSidebar products={products || []} />
            </Suspense>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Trigger & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="lg:hidden w-full sm:w-auto">
                <MobileFilters products={products || []} />
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <p className="text-gray-500 text-sm">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {products?.length || 0}
                  </span>{" "}
                  results
                </p>
                <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-taupe-200">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <ProductGrid products={products || []} />

            {/* Load More (Placeholder) */}
            {products && products.length > 0 && (
              <div className="text-center mt-16">
                <button className="px-8 py-3 border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
