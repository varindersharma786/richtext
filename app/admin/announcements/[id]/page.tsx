import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import AnnouncementForm from "@/components/admin/announcements/AnnouncementForm";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  const { data: announcement } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (!announcement) {
    return notFound();
  }

  return <AnnouncementForm announcement={announcement} />;
}
