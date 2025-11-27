// hooks/use-cart.ts
"use client";

import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    image_urls?: string[] | null;
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
    updateQuantity: (productId: string, quantity: number) => void;
    decrementQuantity: (productId: string) => void;
    clearCart: () => void;
    setIsOpen: (open: boolean) => void;
    totalItems: () => number;
    totalPrice: () => number;
};

export const useCart = create<CartStore>()(
    persist(
        (set, get) => ({
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
                        toast.success("Added to cart", {
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

            updateQuantity: (productId, quantity) => {
                if (quantity < 1) {
                    get().removeFromCart(productId);
                    return;
                }

                set((state) => {
                    const item = state.items.find((i) => i.id === productId);
                    if (item && quantity > item.stock) {
                        toast.error("Not enough stock available");
                        return state;
                    }

                    return {
                        items: state.items.map((i) =>
                            i.id === productId ? { ...i, quantity } : i
                        ),
                    };
                });
            },

            decrementQuantity: (productId) => {
                set((state) => {
                    const item = state.items.find((i) => i.id === productId);
                    if (!item) return state;

                    if (item.quantity <= 1) {
                        return {
                            items: state.items.filter((i) => i.id !== productId),
                        };
                    }

                    return {
                        items: state.items.map((i) =>
                            i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
                        ),
                    };
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== productId),
                }));
                toast.success("Removed from cart",{
                    description: "Item removed from cart",
                });
            },

            clearCart: () => set({ items: [] }),

            setIsOpen: (open) => set({ isOpen: open }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: "cart-storage",
        }
    )
);