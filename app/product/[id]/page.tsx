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

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-6 max-w-7xl">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-gray-500 hover:text-taupe-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ProductGallery images={[product.image_url]} />
          </div>

          {/* Info */}
          <div>
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Tabs: Description, Reviews, Shipping */}
        <div className="max-w-4xl mx-auto mb-24">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="border-t border-gray-100 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-taupe-900 mb-4">
              You May Also Like
            </h2>
            <p className="text-gray-500">
              Curated recommendations based on your selection.
            </p>
          </div>
          <ProductCarousel products={related} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
