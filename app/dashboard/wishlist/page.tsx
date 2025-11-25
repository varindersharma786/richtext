import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function UserWishlistPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Mock wishlist items
  const wishlistItems = [
    {
      id: 1,
      name: "The Perfect T-Shirt",
      price: 2500,
      image: "/placeholder.jpg",
      inStock: true,
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: 8900,
      image: "/placeholder.jpg",
      inStock: true,
    },
    {
      id: 3,
      name: "Wool Scarf",
      price: 1500,
      image: "/placeholder.jpg",
      inStock: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-taupe-900 dark:text-white">
          Wishlist
        </h2>
        <p className="text-muted-foreground">Items you've saved for later.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-neutral-800"
          >
            <div className="aspect-square relative bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-1">{item.name}</h3>
              <p className="text-muted-foreground mb-4">₹{item.price}</p>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-taupe-900 hover:bg-taupe-800 text-white"
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
