import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

const supabase = createAdminClient();

export async function GET() {
    const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url, image_urls")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

    return NextResponse.json(data || []);
}
