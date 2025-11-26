import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import CategoryActions from "@/components/admin/categories/CategoryActions";
import Image from "next/image";

export default async function CategoriesPage() {
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

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => {
              const parent = categories.find(
                (c) => c.id === category.parent_id
              );
              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    /{category.slug}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {parent ? parent.name : "-"}
                  </TableCell>
                  <TableCell>{category.display_order}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <CategoryActions category={category} />
                  </TableCell>
                </TableRow>
              );
            })}
            {(!categories || categories.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No categories found. Click "Add Category" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
