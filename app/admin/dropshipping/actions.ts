"use server";

import { CJDropshippingClient, CJProduct } from "@/lib/cj-dropshipping";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const apiKey = process.env.CJ_API_KEY;
if (!apiKey) throw new Error("Missing CJ API Key");

const cjClient = new CJDropshippingClient(apiKey as string);

export async function searchCJProducts(keyword: string, page: number = 1) {
    try {
        console.log("Searching for products...");
        const result = await cjClient.searchProducts(keyword, page);
        console.log(result);
        return { success: true, data: result };
    } catch (error: any) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

// Types (adjust based on your actual CJ response)
interface CJProductDetails {
    pid: string;
    productName?: string | string[];
    productNameEn?: string;
    productNameSet?: string[];
    productImage?: string | string[];
    productImageSet?: string[];
    description?: string;
    sellPrice: string;
    suggestSellPrice?: string;
    variants?: Array<{
        variantImage?: string;
        variantSellPrice?: string;
    }>;
    categoryName?: string;
    [key: string]: any;
}
export async function importCJProduct(product: CJProduct) {
    const supabase = await createClient();

    try {
        // Fetch full details
        const details: CJProductDetails = await cjClient.getProductDetails(product.pid);
        if (!details) throw new Error("Failed to fetch product from CJ");

        // Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // ──────────────────────────────
        // 1. Smart Text Parsing (CJ sends JSON strings!)
        // ──────────────────────────────
        const parseJsonField = (field: any): any => {
            if (typeof field === "string") {
                try {
                    const parsed = JSON.parse(field);
                    return Array.isArray(parsed) ? parsed : [parsed];
                } catch {
                    return field;
                }
            }
            return Array.isArray(field) ? field : field ? [field] : [];
        };

        const nameOptions = [
            ...parseJsonField(details.productNameEn),
            ...parseJsonField(details.productName),
            ...(details.productNameSet || []),
        ].filter(Boolean);

        const bestName = nameOptions[0] || "Untitled Product";

        // ──────────────────────────────
        // 2. Smart Image Extraction (handles ALL CJ formats)
        // ──────────────────────────────
        const collectImages = (): string[] => {
            const set = new Set<string>();

            const add = (img: any) => {
                if (!img) return;
                if (typeof img === "string") {
                    if (img.startsWith("http")) set.add(img.trim());
                    else {
                        // It's a JSON string like '["url1","url2"]'
                        try {
                            const parsed = JSON.parse(img);
                            if (Array.isArray(parsed)) {
                                parsed.forEach((url: string) => url && set.add(url.trim()));
                            }
                        } catch { }
                    }
                } else if (Array.isArray(img)) {
                    img.forEach(add);
                }
            };

            // Main sources
            add(details.productImage);
            add(details.productImageSet);

            // Fallback: variant images
            if (details.variants?.length) {
                details.variants.forEach(v => add(v.variantImage));
            }

            return Array.from(set);
        };

        const allImages = collectImages();
        const primaryImage = allImages[0] || null;

        // ──────────────────────────────
        // 3. Generate clean slug
        // ──────────────────────────────
        const slug = bestName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
            .slice(0, 100) || `cj-${details.pid}`;

        // ──────────────────────────────
        // 3.5. Handle Category
        // ──────────────────────────────
        let categoryId = null;
        if (details.categoryName) {
            // Check if category exists
            const { data: existingCategory } = await supabase
                .from("categories")
                .select("id")
                .eq("name", details.categoryName)
                .single();

            if (existingCategory) {
                categoryId = existingCategory.id;
            } else {
                // Create new category
                const categorySlug = details.categoryName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "");

                const { data: newCategory, error: categoryError } = await supabase
                    .from("categories")
                    .insert({
                        name: details.categoryName,
                        slug: categorySlug,
                        is_active: true,
                        display_order: 0,
                    })
                    .select("id")
                    .single();

                if (!categoryError && newCategory) {
                    categoryId = newCategory.id;
                } else {
                    console.error("Failed to create category:", categoryError);
                }
            }
        }

        // ──────────────────────────────
        // 4. Final Product Data
        // ──────────────────────────────
        const productData = {
            name: details.productNameEn,
            description: details.description?.trim() || null,
            price: parseFloat(details.sellPrice || details.variants?.[0]?.variantSellPrice || "0") || 0,
            compare_at_price: parseFloat(details.suggestSellPrice || "0") || null,
            cost_price: parseFloat(details.sellPrice || "0") || null,
            stock: 999, // CJ usually has stock
            is_active: false, // draft
            category_id: categoryId,
            image_url: primaryImage,                    // single string
            image_urls: allImages.length > 0 ? allImages : null, // string[]
            slug,
            seo_title: details.productNameEn,
            seo_description: details.productNameEn,
            seo_keywords: [
                "cj dropshipping",
                "shoe rack",
                "shoes organizer",
                details.categoryName,
            ].filter(Boolean),
        };

        // ──────────────────────────────
        // 5. Insert into Supabase
        // ──────────────────────────────
    
        const { data, error } = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single();

        if (error) {
            if (error.code === "23505") {
                throw new Error(`Product already imported: ${details.productNameEn}`);
            }
            throw error;
        }

        revalidatePath("/admin/products");
        revalidatePath(`/admin/products/${data.id}`);

        return {
            success: true,
            data,
            message: "Product imported successfully!",
        };
    } catch (error: any) {
        console.error("CJ Import Failed:", error);
        return {
            success: false,
            error: error.message || "Import failed",
        };
    }
}