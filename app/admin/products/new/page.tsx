import ProductForm from "@/components/admin/products/ProductForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/dashboard");
  }

  // Fetch categories for category selector
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <div className="space-y-6 pb-16">
      ​
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
      </div>
      <ProductForm categories={categories || []} />
    </div>
  );
}
