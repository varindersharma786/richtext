// utils/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log(process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.NEXT_PUBLIC_SUPABASE_URL);
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
};
