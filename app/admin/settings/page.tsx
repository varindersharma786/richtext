import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
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

  // Fetch store settings
  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          Settings
        </h2>
        <p className="text-muted-foreground">Manage your platform settings.</p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
