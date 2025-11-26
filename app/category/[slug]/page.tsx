import ProductCard from "@/components/store/ProductCard";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";

const supabase = createAdminClient();

async function getCategory(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) notFound();
  return data;
}

async function getCategoryProducts(categoryId: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return data || [];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const products = await getCategoryProducts(category.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-4">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">
              No products found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
