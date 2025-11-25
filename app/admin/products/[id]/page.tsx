// app/(admin)/products/[id]/page.tsx
import { createAdminClient } from "@/utils/supabase/admin";
import ProductForm from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

const supabase = createAdminClient();

async function getProduct(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  return data;
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">Update product details</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}