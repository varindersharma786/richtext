import { createAdminClient } from "@/utils/supabase/admin";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const supabase = createAdminClient();

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return data || [];
}

async function getCategoryProductCount(categoryId: string) {
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId)
    .eq("is_active", true);

  return count || 0;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      productCount: await getCategoryProductCount(category.id),
    }))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our curated collection of products organized by category
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {categoriesWithCounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoriesWithCounts.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {category.image_url ? (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl text-gray-300">📦</div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "product" : "products"}
                      </span>
                      <span className="text-gray-900 font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
                        Browse →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Categories Yet
            </h3>
            <p className="text-gray-600">
              Categories will appear here once they're added
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Browse our complete product collection or get in touch with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all inline-block"
            >
              View All Products
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all inline-block"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
