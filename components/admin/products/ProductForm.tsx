"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  is_active: z.boolean(),
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
      className="relative group rounded-lg border-2 border-dashed border-gray-300 p-2 bg-white hover:border-purple-500 transition-colors"
    >
      <div className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
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

export default function ProductForm({ product }: { product?: Product }) {
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          price: product.price,
          stock: product.stock,
          is_active: product.is_active,
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock: 0,
          is_active: true,
        },
  });

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

      const productData = {
        ...values,
        image_url: imageUrls[0] || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      };

      if (product) {
        // Update existing
        await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);
        toast.success("Product updated successfully!");
      } else {
        // Create new
        await supabase.from("products").insert(productData);
        toast.success("Product created successfully!");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Create Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="iPhone 15 Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Controller
                      name="description"
                      control={form.control}
                      render={({ field }) => (
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write a detailed product description..."
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="999"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
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
            </div>

            {/* Image Upload Section */}
            <div>
              <Label>Product Images (Up to 6)</Label>
              <div className="mt-2 space-y-4">
                {/* Image Grid */}
                {images.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-3 gap-4">
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

                {/* Upload Button */}
                {images.length < 6 && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload images ({images.length}/6)
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB
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
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading
                  ? "Saving..."
                  : product
                    ? "Update Product"
                    : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
