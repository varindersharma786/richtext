import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import AnnouncementTable from "@/components/admin/announcements/AnnouncementTable";

export default async function AnnouncementsPage() {
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

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Manage site-wide announcement bars
          </p>
        </div>
        <Link href="/admin/announcements/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </Link>
      </div>

      <AnnouncementTable announcements={announcements || []} />
    </div>
  );
}
