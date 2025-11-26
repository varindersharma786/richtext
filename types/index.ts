// types/index.ts
export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    updated_at: string | null;
                    username: string | null;
                    full_name: string | null;
                    avatar_url: string | null;
                    website: string | null;
                    role: 'user' | 'admin';
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id'> & { id?: string };
                Update: Partial<Database['public']['Tables']['profiles']['Row']>;
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    parent_id: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
            };
            products: {
                Row: {
                    id: string;
                    created_at: string;
                    name: string;
                    description: string | null;
                    price: number;
                    image_url: string | null;
                    image_urls: string[] | null;
                    stock: number;
                    is_active: boolean;
                    category_id: string | null;
                    seo_title: string | null;
                    seo_description: string | null;
                    seo_keywords: string[] | null;
                    slug: string | null;
                };
            };
            page_seo: {
                Row: {
                    id: string;
                    page_path: string;
                    page_name: string;
                    seo_title: string | null;
                    seo_description: string | null;
                    seo_keywords: string[] | null;
                    og_image: string | null;
                    created_at: string;
                    updated_at: string;
                };
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    razorpay_order_id: string;
                    razorpay_payment_id: string | null;
                    payment_provider: string;
                    payment_id: string | null;
                    amount: number;
                    status: 'created' | 'paid' | 'failed';
                    created_at: string;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string;
                    quantity: number;
                    price: number;
                };
            };
            announcements: {
                Row: {
                    id: string;
                    message: string;
                    link_url: string | null;
                    link_text: string | null;
                    background_color: string;
                    text_color: string;
                    is_active: boolean;
                    display_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
            };
            banners: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    image_url: string;
                    link_url: string | null;
                    button_text: string | null;
                    position: 'home' | 'products' | 'all';
                    is_active: boolean;
                    display_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at' | 'updated_at'> & {
                    id?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['banners']['Insert']>;
            };
            store_settings: {
                Row: {
                    id: string;
                    store_name: string;
                    support_email: string;
                    social_links: {
                        facebook: string;
                        twitter: string;
                        instagram: string;
                        youtube: string;
                    };
                    logo_url: string | null;
                    maintenance_mode: boolean;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['store_settings']['Row'], 'id' | 'updated_at'> & {
                    id?: string;
                    updated_at?: string;
                };
                Update: Partial<Database['public']['Tables']['store_settings']['Insert']>;
            };
        };
    };
};