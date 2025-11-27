"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export default function UserWishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("wishlist")
        .select(
          `
          id,
          product_id,
          products (
            id,
            name,
            price,
            image_url,
            stock
          )
        `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to load wishlist");
      } else {
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(wishlistId: string) {
    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId);

      if (error) throw error;

      setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  }

  async function addToCart(productId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please login to add items to cart");
        return;
      }

      // Check if item already in cart
      const { data: existingCart } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      if (existingCart) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingCart.quantity + 1 })
          .eq("id", existingCart.id);

        if (error) throw error;
      } else {
        // Insert new cart item
        const { error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id: productId, quantity: 1 });

        if (error) throw error;
      }

      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          Wishlist
        </h2>
        <p className="text-muted-foreground">Items you've saved for later.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-neutral-800"
            >
              <div className="aspect-square relative bg-gray-100">
                <img
                  src={item.products.image_url || "/placeholder.jpg"}
                  alt={item.products.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-1">
                  {item.products.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  ₹{Number(item.products.price).toLocaleString("en-IN")}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-taupe-900 hover:bg-taupe-800 text-white"
                    disabled={!item.products.stock || item.products.stock === 0}
                    onClick={() => addToCart(item.product_id)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.products.stock && item.products.stock > 0
                      ? "Add to Cart"
                      : "Out of Stock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm bg-white dark:bg-neutral-900">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Heart className="h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Save items you love to your wishlist
            </p>
            <Button
              asChild
              className="bg-taupe-900 hover:bg-taupe-800 text-white"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
