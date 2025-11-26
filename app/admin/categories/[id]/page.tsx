import CategoryForm from "@/components/admin/categories/CategoryForm";
import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  // Fetch category
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !category) {
    notFound();
  }

  // Fetch all categories for parent selection
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
        <p className="text-muted-foreground">Update category details.</p>
      </div>
      <CategoryForm category={category} categories={categories || []} />
    </div>
  );
}
