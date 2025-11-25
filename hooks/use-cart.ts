// hooks/use-cart.ts
"use client";

import { toast } from "sonner";
import { create } from "zustand";


type Product = {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
};

type CartItem = Product & {
    quantity: number;
};

type CartStore = {
    items: CartItem[];
    isOpen: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    setIsOpen: (open: boolean) => void;
    totalItems: () => number;
    totalPrice: () => number;
};

export const useCart = create<CartStore>((set, get) => ({
    items: [],
    isOpen: false,

    addToCart: (product) => {
        set((state) => {
            const existing = state.items.find((i) => i.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    toast.error("Out of stock", {

                        description: `Only ${product.stock} units available`,

                    });
                    return state;
                }
                toast.success("Added to cart",{
             
                    description: `${product.name} × ${existing.quantity + 1}`,
                });
                return {
                    items: state.items.map((i) =>
                        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }

            toast.success("Added to cart", {
                description: product.name,
            });
            return { items: [...state.items, { ...product, quantity: 1 }] };
        });
    },

    removeFromCart: (productId) => {
        set((state) => ({
            items: state.items.filter((i) => i.id !== productId),
        }));
        toast.success("Removed from cart");
    },

    clearCart: () => set({ items: [] }),

    setIsOpen: (open) => set({ isOpen: open }),

    totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

    totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));