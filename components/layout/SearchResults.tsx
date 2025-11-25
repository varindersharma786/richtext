// components/layout/SearchResults.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .ilike("name", `%${query}%`)
        .limit(6);

      setResults(data || []);
      setOpen(true);
      setLoading(false);
    };

    const delay = setTimeout(search, 300);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative">
      <div className="flex items-center bg-white/20 backdrop-blur-xl rounded-full px-5 h-12 border border-white/30">
        <Search className="w-5 h-5 text-white mr-3" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-0 text-white placeholder-white/70 focus-visible:ring-0 h-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuery("")}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      {open && (
        <div className="absolute top-full mt-3 w-full bg-white rounded-3xl shadow-2xl overflow-hidden border">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No products found</div>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={product.image_url || "/placeholder.jpg"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-purple-600 font-bold">₹{product.price}</p>
                </div>
              </Link>
            ))
          )}
          {results.length > 0 && (
            <div className="p-4 bg-gray-50 text-center">
              <Link
                href={`/products?q=${query}`}
                className="text-purple-600 font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                View all results →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}