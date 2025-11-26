import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

const supabase = createAdminClient();

export async function GET() {
    const { data } = await supabase
        .from("categories")
        .select("id, name, slug, image_url")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .limit(6);

    return NextResponse.json(data || []);
}
