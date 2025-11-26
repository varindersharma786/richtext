import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ProductCarousel from "@/components/product/ProductCarousel";
import { createAdminClient } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const supabase = createAdminClient();

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data || !data.is_active) notFound();
  return data;
}

async function getRelatedProducts(currentId: string) {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .neq("id", currentId)
    .limit(8);
  return data || [];
}

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProduct(id);
  const related = await getRelatedProducts(id);

  // Get images array - use image_urls if available, fallback to single image_url
  const productImages =
    product.image_urls && product.image_urls.length > 0
      ? product.image_urls
      : product.image_url
        ? [product.image_url]
        : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-6 max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 mb-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28 h-fit">
            <ProductGallery images={productImages} />
          </div>

          {/* Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs: Description, Reviews, Shipping */}
        <div className="max-w-5xl mx-auto mb-24">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="border-t border-gray-200 pt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                You May Also Like
              </h2>
              <p className="text-gray-600 text-lg">
                Curated recommendations based on your selection.
              </p>
            </div>
            <ProductCarousel products={related} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
