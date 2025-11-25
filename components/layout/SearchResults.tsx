// components/layout/SearchResults.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function SearchResults({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url")
        .ilike("name", `%${query}%`)
        .limit(8);

      setResults(data || []);
      setLoading(false);
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-6 h-6 text-gray-500" />
        <Input
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg border-none focus:ring-0"
          autoFocus
        />
        <button onClick={onClose}>
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Searching...</p>
      ) : results.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={onClose}
              className="group"
            >
              <div className="bg-gray-50 rounded-2xl overflow-hidden">
                <Image
                  src={product.image_url || "/placeholder.jpg"}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition"
                />
                <div className="p-3">
                  <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                  <p className="text-purple-600 font-bold">₹{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}