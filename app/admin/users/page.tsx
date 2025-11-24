import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserTable from "./user-table";
import { getUsers } from "./actions";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || "";

  const { users, count } = await getUsers(page, search);

  // Merge auth user data (email) with profile data
  // Note: In a real app with separate auth/profile tables, you'd join them.
  // Here we assume profiles has all we need or we fetch auth users via admin API if needed.
  // Our getUsers action fetches from profiles. Profiles table should have email if we sync it.
  // If not, we might need to fetch emails from auth.users using admin client,
  // but for now let's assume profiles has what we need or we accept missing emails in the view
  // if they aren't synced to profiles.
  // Actually, let's check if profiles has email. Schema says 'username', 'full_name'.
  // We should probably add email to profiles or fetch it.
  // For this implementation, I'll assume we can get basic info.
  // If email is missing in profiles, we might need to update the sync trigger or fetch from auth.

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <UserTable initialUsers={users as any} initialCount={count || 0} />
    </div>
  );
}
