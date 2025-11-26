import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BannerForm from "@/components/admin/banners/BannerForm";

export default async function NewBannerPage() {
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

  return <BannerForm />;
}
