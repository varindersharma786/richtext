"use server";

import { CJDropshippingClient, CJProduct } from "@/lib/cj-dropshipping";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const cjClient = new CJDropshippingClient();

export async function searchCJProducts(keyword: string, page: number = 1) {
    try {
        const result = await cjClient.searchProducts(keyword, page);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function importCJProduct(product: CJProduct) {
    const supabase = await createClient();

    try {
        // 1. Fetch full details to get description and images
        const details = await cjClient.getProductDetails(product.pid);

        // 2. Map to our product schema
        // Note: We might want to download images and upload to our storage, 
        // but for now we'll use the external URLs to save bandwidth/storage.

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const productData = {
            name: details.productNameEn || details.productName,
            description: details.description, // CJ descriptions can be HTML
            price: parseFloat(details.sellPrice),
            stock: 100, // Default stock as we don't track CJ stock in real-time yet
            is_active: false, // Import as draft
            image_url: details.productImage,
            image_urls: details.productImages || [details.productImage],
            slug: (details.productNameEn || details.productName)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, ""),
            seo_title: details.productNameEn,
            seo_keywords: ["cj-dropshipping", details.categoryName],
            // We could store CJ PID in a specific column if we added one
        };

        const { data, error } = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/admin/products");
        return { success: true, data };
    } catch (error: any) {
        console.error("Import Error:", error);
        return { success: false, error: error.message };
    }
}
