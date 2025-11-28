// Type definitions for product variants
export interface ProductVariant {
    id?: string;
    product_id?: string;
    variant_name: string;
    sku: string;
    price_adjustment: number;
    stock: number;
    image_url?: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface VariantFormData {
    variant_name: string;
    sku: string;
    price_adjustment: number;
    stock: number;
    image_url?: string;
}
