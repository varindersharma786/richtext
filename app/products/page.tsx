import FiltersSidebar from "@/components/store/FiltersSidebar";
import MobileFilters from "@/components/store/MobileFilters";
import ProductGrid from "@/components/product/ProductGrid";
import SortSelect from "@/components/store/SortSelect";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();

  // Parse filters
  const minPrice = Number(searchParams.min_price) || 0;
  const maxPrice = Number(searchParams.max_price) || 1000000;
  const categories = searchParams.categories
    ? (searchParams.categories as string).split(",")
    : [];
  const inStock = searchParams.in_stock === "true";
  const sort = (searchParams.sort as string) || "newest";

  let query = supabase
    .from("products")
    .select("id, name, price, image_url, stock, is_active, category_id")
    .eq("is_active", true)
    .gte("price", minPrice)
    .lte("price", maxPrice);

  if (inStock) {
    query = query.gt("stock", 0);
  }

  // Apply sorting
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Header */}
      <section className="relative bg-neutral-100 dark:bg-neutral-900 py-16 border-b border-gray-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 max-w-[1400px] text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900 dark:text-white">
            All Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Explore our latest collection of timeless pieces
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-[1400px] py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Suspense fallback={<div>Loading filters...</div>}>
              <FiltersSidebar products={products || []} />
            </Suspense>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filters Trigger & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="lg:hidden w-full sm:w-auto">
                <MobileFilters products={products || []} />
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {products?.length || 0}
                  </span>{" "}
                  products
                </p>
                <SortSelect />
              </div>
            </div>

            <ProductGrid products={products || []} />

            {/* Load More (Placeholder) */}
            {products && products.length > 0 && (
              <div className="text-center mt-16">
                <button className="px-8 py-3 border border-gray-900 dark:border-white text-sm font-medium hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors rounded-none uppercase tracking-widest">
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
