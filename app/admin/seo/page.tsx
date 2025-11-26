import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import PageSEOForm from "@/components/admin/seo/PageSEOForm";

export default async function SEOPage() {
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

  // Fetch all page SEO settings
  const { data: pages } = await supabase
    .from("page_seo")
    .select("*")
    .order("page_path", { ascending: true });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SEO Management</h2>
        <p className="text-muted-foreground">
          Manage SEO settings for all pages on your site
        </p>
      </div>

      <div className="space-y-6">
        {pages?.map((page) => (
          <PageSEOForm key={page.id} pageSEO={page} />
        ))}
        {(!pages || pages.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            No pages found. Run the migration to create default pages.
          </div>
        )}
      </div>
    </div>
  );
}
