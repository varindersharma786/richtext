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
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
  link_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  link_text: z.string().optional(),
  background_color: z.string().min(1, "Background color is required"),
  text_color: z.string().min(1, "Text color is required"),
  display_order: z.number().int().min(0),
});

type FormValues = z.infer<typeof formSchema>;

interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_text: string | null;
  background_color: string;
  text_color: string;
  display_order: number;
}

export default function AnnouncementForm({
  announcement,
}: {
  announcement?: Announcement;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: announcement?.message || "",
      link_url: announcement?.link_url || "",
      link_text: announcement?.link_text || "",
      background_color: announcement?.background_color || "#000000",
      text_color: announcement?.text_color || "#FFFFFF",
      display_order: announcement?.display_order || 0,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const data = {
        message: values.message,
        link_url: values.link_url || null,
        link_text: values.link_text || null,
        background_color: values.background_color,
        text_color: values.text_color,
        display_order: values.display_order,
      };

      if (announcement) {
        const { error } = await supabase
          .from("announcements")
          .update(data)
          .eq("id", announcement.id);

        if (error) throw error;
        toast.success("Announcement updated successfully!");
      } else {
        const { error } = await supabase.from("announcements").insert(data);

        if (error) throw error;
        toast.success("Announcement created successfully!");
      }

      router.push("/admin/announcements");
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
          href="/admin/announcements"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Announcements
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {announcement ? "Edit Announcement" : "New Announcement"}
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Announcement Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Enter announcement message"
                  rows={3}
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="background_color"
                      {...register("background_color")}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={watchedValues.background_color}
                      onChange={(e) =>
                        register("background_color").onChange({
                          target: { value: e.target.value },
                        })
                      }
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="text_color"
                      {...register("text_color")}
                      className="w-20 h-10"
                    />
                    <Input
                      type="text"
                      value={watchedValues.text_color}
                      onChange={(e) =>
                        register("text_color").onChange({
                          target: { value: e.target.value },
                        })
                      }
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="link_url">Link URL (optional)</Label>
                <Input
                  id="link_url"
                  {...register("link_url")}
                  placeholder="https://example.com"
                />
                {errors.link_url && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.link_url.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="link_text">Link Text (optional)</Label>
                <Input
                  id="link_text"
                  {...register("link_text")}
                  placeholder="Learn More"
                />
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
                  disabled={saving}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  {saving
                    ? "Saving..."
                    : announcement
                      ? "Update Announcement"
                      : "Create Announcement"}
                </Button>
                <Link href="/admin/announcements">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="py-3 px-6 rounded-lg text-center"
              style={{
                backgroundColor: watchedValues.background_color,
                color: watchedValues.text_color,
              }}
            >
              <p className="text-sm font-medium">
                {watchedValues.message || "Your announcement will appear here"}
              </p>
              {watchedValues.link_url && (
                <a
                  href={watchedValues.link_url}
                  className="text-sm underline ml-2"
                  style={{ color: watchedValues.text_color }}
                  onClick={(e) => e.preventDefault()}
                >
                  {watchedValues.link_text || "Learn More"}
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              This is how your announcement will appear on the storefront.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
