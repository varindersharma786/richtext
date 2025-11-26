"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  seo_title: z
    .string()
    .max(60, "SEO title should be under 60 characters")
    .optional(),
  seo_description: z
    .string()
    .max(160, "SEO description should be under 160 characters")
    .optional(),
  seo_keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PageSEO {
  id: string;
  page_path: string;
  page_name: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  og_image: string | null;
}

export default function PageSEOForm({ pageSEO }: { pageSEO: PageSEO }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    pageSEO.og_image || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seo_title: pageSEO.seo_title || "",
      seo_description: pageSEO.seo_description || "",
      seo_keywords: pageSEO.seo_keywords?.join(", ") || "",
    },
  });

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
      setSaving(true);
      let ogImageUrl = pageSEO.og_image;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `og-${pageSEO.page_path.replace(/\//g, "-")}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("seo")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("seo").getPublicUrl(fileName);
        ogImageUrl = data.publicUrl;
      }

      const keywords = values.seo_keywords
        ?.split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const { error } = await supabase
        .from("page_seo")
        .update({
          seo_title: values.seo_title || null,
          seo_description: values.seo_description || null,
          seo_keywords: keywords || null,
          og_image: ogImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pageSEO.id);

      if (error) throw error;

      toast.success("SEO settings updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update SEO settings");
    } finally {
      setSaving(false);
    }
  };

  const titleLength = form.watch("seo_title")?.length || 0;
  const descriptionLength = form.watch("seo_description")?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pageSEO.page_name} - SEO Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Page URL:</p>
              <p className="font-mono text-sm font-semibold">
                {pageSEO.page_path}
              </p>
            </div>

            <FormField
              control={form.control}
              name="seo_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amazing Products | Your Store"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Shown in search engine results (Google, Bing)</span>
                    <span className={titleLength > 60 ? "text-red-500" : ""}>
                      {titleLength}/60
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
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Shop our amazing collection of products with fast shipping..."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Brief description shown in search results</span>
                    <span
                      className={descriptionLength > 160 ? "text-red-500" : ""}
                    >
                      {descriptionLength}/160
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seo_keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ecommerce, shopping, products"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated keywords for this page
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Open Graph Image</FormLabel>
              <FormDescription className="mb-2">
                Image shown when shared on social media (1200x630px recommended)
              </FormDescription>
              {imagePreview ? (
                <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-4 max-w-md">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto rounded-md"
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
                <label className="flex flex-col items-center justify-center w-full max-w-md h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (1200x630px)
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

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save SEO Settings"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
