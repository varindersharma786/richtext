import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import BannerGrid from "@/components/admin/banners/BannerGrid";

export default async function BannersPage() {
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

  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Banners</h2>
          <p className="text-muted-foreground">
            Manage promotional banners and offers
          </p>
        </div>
        <Link href="/admin/banners/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            New Banner
          </Button>
        </Link>
      </div>

      <BannerGrid banners={banners || []} />
    </div>
  );
}
