// app/product/[id]/page.tsx

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

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
    .select("id, name, price, image_url")
    .eq("is_active", true)
    .neq("id", currentId)
    .limit(8);
  return data || [];
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  const related = await getRelatedProducts(params.id);

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-6 pb-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Gallery */}
            <ProductGallery images={[product.image_url]} />

            {/* Info */}
            <ProductInfo product={product} />
          </div>

          {/* Tabs: Description, Reviews, Shipping */}
          <ProductTabs product={product} />

          {/* Related Products */}
          <RelatedProducts products={related} />
        </div>
      </div>
    </>
  );
}