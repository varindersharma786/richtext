"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  parent_id: z.string().optional(),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  display_order: number;
  is_active: boolean;
  image_url?: string | null;
}

export default function CategoryForm({
  category,
  categories = [],
}: {
  category?: Category;
  categories?: Category[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    category?.image_url || null
  );
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          parent_id: category.parent_id || undefined,
          display_order: category.display_order,
          is_active: category.is_active,
        }
      : {
          name: "",
          slug: "",
          description: "",
          parent_id: undefined,
          display_order: 0,
          is_active: true,
        },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!category) {
      // Auto-generate slug only for new categories
      form.setValue("slug", generateSlug(value));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setUploading(true);
      let imageUrl = category?.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("categories")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("categories")
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const categoryData = {
        ...values,
        parent_id: values.parent_id || null,
        image_url: imageUrl,
      };

      if (category) {
        await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", category.id);
        toast.success("Category updated successfully!");
      } else {
        await supabase.from("categories").insert(categoryData);
        toast.success("Category created successfully!");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  // Filter out current category and its children to prevent circular references
  const availableParents = categories.filter((c) => c.id !== category?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? "Edit Category" : "Create Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Electronics"
                        {...field}
                        onChange={(e) => handleNameChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="electronics" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used in the URL: /category/slug
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Category description..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="None (Top Level)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {availableParents.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Create subcategory under a parent
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Show this category on the site
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Category Image (Optional)</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-4 max-w-xs">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full max-w-xs h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading
                  ? "Saving..."
                  : category
                    ? "Update Category"
                    : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
