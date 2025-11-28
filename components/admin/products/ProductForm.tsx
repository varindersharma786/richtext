"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, GripVertical } from "lucide-react";
import VariantManager from "@/components/admin/products/VariantManager";
import { ProductVariant } from "@/types/product-variant";
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
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  is_active: z.boolean(),
  category_id: z.string().optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
  seo_keywords: z.string().optional(),
  slug: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  is_active: boolean;
  image_url?: string | null;
  image_urls?: string[] | null;
  category_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  slug?: string | null;
}

interface ImageItem {
  id: string;
  file?: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

function SortableImage({
  image,
  onRemove,
}: {
  image: ImageItem;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors bg-white"
    >
      <div className="relative w-24 h-24 rounded-md overflow-hidden">
        <img
          src={image.preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
        <button
          type="button"
          className="absolute top-1 left-1 h-6 w-6 bg-black/50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}

export default function ProductForm({
  product,
  categories = [],
  existingVariants = [],
}: {
  product?: Product;
  categories?: any[];
  existingVariants?: ProductVariant[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [images, setImages] = useState<ImageItem[]>(() => {
    if (product?.image_urls && product.image_urls.length > 0) {
      return product.image_urls.map((url, index) => ({
        id: `existing-${index}`,
        preview: url,
        uploaded: true,
        url: url,
      }));
    } else if (product?.image_url) {
      return [
        {
          id: "existing-0",
          preview: product.image_url,
          uploaded: true,
          url: product.image_url,
        },
      ];
    }
    return [];
  });
  const [uploading, setUploading] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>(existingVariants);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          stock: product.stock,
          is_active: product.is_active,
          category_id: product.category_id || undefined,
          seo_title: product.seo_title || "",
          seo_description: product.seo_description || "",
          seo_keywords: product.seo_keywords?.join(", ") || "",
          slug: product.slug || "",
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          is_active: true,
          category_id: undefined,
          seo_title: "",
          seo_description: "",
          seo_keywords: "",
          slug: "",
        },
  });

  const handleNameChange = (value: string) => {
    form.setValue("name", value);
    if (!product) {
      form.setValue("slug", generateSlug(value));
      if (!form.getValues("seo_title")) {
        form.setValue("seo_title", value);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: ImageItem[] = Array.from(files).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        uploaded: false,
      }));

      if (images.length + newImages.length > 6) {
        toast.error("Maximum 6 images allowed");
        return;
      }

      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setUploading(true);
      const imageUrls: string[] = [];

      // Upload new images
      for (const image of images) {
        if (image.uploaded && image.url) {
          imageUrls.push(image.url);
        } else if (image.file) {
          const fileExt = image.file.name.split(".").pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("products")
            .upload(fileName, image.file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from("products")
            .getPublicUrl(fileName);
          imageUrls.push(data.publicUrl);
        }
      }

      const keywords = values.seo_keywords
        ?.split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const productData = {
        name: values.name,
        description: values.description || null,
        price: values.price,
        stock: values.stock,
        is_active: values.is_active,
        category_id: values.category_id || null,
        image_url: imageUrls[0] || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        seo_title: values.seo_title || null,
        seo_description: values.seo_description || null,
        seo_keywords: keywords || null,
        slug: values.slug || generateSlug(values.name),
      };

      let productId = product?.id;

      if (product) {
        await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        // Delete existing variants and re-insert (simpler than update logic)
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", product.id);
      } else {
        const { data: newProduct } = await supabase
          .from("products")
          .insert(productData)
          .select("id")
          .single();
        productId = newProduct?.id;
      }

      // Insert variants if any
      if (variants.length > 0 && productId) {
        const variantsToInsert = variants.map((v, index) => ({
          product_id: productId,
          variant_name: v.variant_name,
          sku: v.sku,
          price_adjustment: v.price_adjustment,
          stock: v.stock,
          image_url: v.image_url || null,
          sort_order: index,
          is_active: v.is_active,
        }));

        await supabase.from("product_variants").insert(variantsToInsert);
      }

      toast.success(
        product
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const seoTitleLength = form.watch("seo_title")?.length || 0;
  const seoDescLength = form.watch("seo_description")?.length || 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product name"
                          className="text-lg"
                          {...field}
                          onChange={(e) => handleNameChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Controller
                          name="description"
                          control={form.control}
                          render={({ field }) => (
                            <RichTextEditor
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="Describe your product..."
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Media */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {images.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex flex-wrap gap-3">
                        {images.map((image) => (
                          <SortableImage
                            key={image.id}
                            image={image}
                            onRemove={() => removeImage(image.id)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}

                {images.length < 6 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Add images ({images.length}/6)
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₹
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Variants */}
            <VariantManager
              variants={variants}
              onVariantsChange={setVariants}
              basePrice={form.watch("price") || 0}
            />

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Search Engine Listing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="seo_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormDescription className="flex justify-between">
                        <span>Shown in search results</span>
                        <span
                          className={seoTitleLength > 60 ? "text-red-500" : ""}
                        >
                          {seoTitleLength}/60
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seo_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief product description for search engines"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="flex justify-between">
                        <span>Brief description</span>
                        <span
                          className={seoDescLength > 160 ? "text-red-500" : ""}
                        >
                          {seoDescLength}/160
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Handle</FormLabel>
                      <FormControl>
                        <Input placeholder="product-name" {...field} />
                      </FormControl>
                      <FormDescription>
                        /product/{field.value || "product-name"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-normal">
                          {field.value ? "Active" : "Draft"}
                        </FormLabel>
                        <FormDescription className="text-xs">
                          {field.value ? "Visible to customers" : "Hidden"}
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
                <div className="mt-4 space-y-2">
                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? "Saving..." : "Save Product"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/products")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Organization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No category</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
