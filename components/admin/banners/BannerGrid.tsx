"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
  position: string;
  is_active: boolean;
  display_order: number;
}

export default function BannerGrid({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  const toggleActive = async (id: string, currentState: boolean) => {
    setLoading(id);
    try {
      const { error } = await supabase
        .from("banners")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Banner ${!currentState ? "activated" : "deactivated"}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update banner");
    } finally {
      setLoading(null);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    setLoading(id);
    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);

      if (error) throw error;

      toast.success("Banner deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete banner");
    } finally {
      setLoading(null);
    }
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">No banners yet</p>
        <Link href="/admin/banners/new">
          <Button>Create your first banner</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {banners.map((banner) => (
        <Card key={banner.id} className="overflow-hidden">
          <div className="relative h-48 bg-gray-100">
            <Image
              src={banner.image_url}
              alt={banner.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg truncate">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {banner.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 items-center my-3">
              <Badge variant={banner.is_active ? "default" : "secondary"}>
                {banner.is_active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {banner.position}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                Order: {banner.display_order}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => toggleActive(banner.id, banner.is_active)}
                disabled={loading === banner.id}
              >
                {banner.is_active ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
              <Link href={`/admin/banners/${banner.id}`}>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteBanner(banner.id)}
                disabled={loading === banner.id}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
