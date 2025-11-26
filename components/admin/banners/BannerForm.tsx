"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").min(1, "Image is required"),
  link_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  button_text: z.string().optional(),
  position: z.enum(["home", "products", "all"]),
  display_order: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  position: string;
  display_order: number;
}

export default function BannerForm({ banner }: { banner?: Banner }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: banner?.title || "",
      description: banner?.description || "",
      image_url: banner?.image_url || "",
      link_url: banner?.link_url || "",
      button_text: banner?.button_text || "",
      position: (banner?.position as "home" | "products" | "all") || "home",
      display_order: banner?.display_order || 0,
    },
  });

  const watchedValues = watch();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      setValue("image_url", publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const data = {
        title: values.title,
        description: values.description || null,
        image_url: values.image_url,
        link_url: values.link_url || null,
        button_text: values.button_text || null,
        position: values.position,
        display_order: values.display_order,
      };

      if (banner) {
        const { error } = await supabase
          .from("banners")
          .update(data)
          .eq("id", banner.id);

        if (error) throw error;
        toast.success("Banner updated successfully!");
      } else {
        const { error } = await supabase.from("banners").insert(data);

        if (error) throw error;
        toast.success("Banner created successfully!");
      }

      router.push("/admin/banners");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <Link
          href="/admin/banners"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Banners
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {banner ? "Edit Banner" : "New Banner"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Summer Sale 2024"
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Get up to 50% off on selected items"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Banner Image *</Label>
                <div className="mt-2">
                  {watchedValues.image_url ? (
                    <div className="relative h-48 rounded-lg overflow-hidden border">
                      <Image
                        src={watchedValues.image_url}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => setValue("image_url", "")}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={uploadImage}
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                  {errors.image_url && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.image_url.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="link_url">Link URL (optional)</Label>
                <Input
                  id="link_url"
                  {...register("link_url")}
                  placeholder="https://example.com/sale"
                />
                {errors.link_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.link_url.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="button_text">Button Text (optional)</Label>
                <Input
                  id="button_text"
                  {...register("button_text")}
                  placeholder="Shop Now"
                />
              </div>

              <div>
                <Label htmlFor="position">Position *</Label>
                <Select
                  value={watchedValues.position}
                  onValueChange={(value) =>
                    setValue("position", value as "home" | "products" | "all")
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Page</SelectItem>
                    <SelectItem value="products">Products Page</SelectItem>
                    <SelectItem value="all">All Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  type="number"
                  id="display_order"
                  {...register("display_order", { valueAsNumber: true })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={saving || uploading}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  {saving
                    ? "Saving..."
                    : banner
                      ? "Update Banner"
                      : "Create Banner"}
                </Button>
                <Link href="/admin/banners">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {watchedValues.image_url ? (
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={watchedValues.image_url}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {watchedValues.title || "Banner Title"}
                    </h3>
                    {watchedValues.description && (
                      <p className="text-white/90 text-sm mb-4">
                        {watchedValues.description}
                      </p>
                    )}
                    {watchedValues.button_text && (
                      <Button className="w-fit bg-white text-black hover:bg-gray-100">
                        {watchedValues.button_text}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  Upload an image to see preview
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-4">
                Position:{" "}
                <span className="font-medium capitalize">
                  {watchedValues.position}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
