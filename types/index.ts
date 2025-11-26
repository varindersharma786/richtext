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
        };
    };
};