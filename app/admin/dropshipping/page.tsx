"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { CJProduct } from "@/lib/cj-dropshipping";
import { searchCJProducts } from "./actions";
import CJProductCard from "@/components/admin/dropshipping/CJProductCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DropshippingPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setProducts([]);

    try {
      const result = await searchCJProducts(keyword);
      if (result.success && result.data) {
        setProducts(result.data.list || []);
      } else {
        setError(result.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CJ Dropshipping</h1>
          <p className="text-muted-foreground">
            Search and import products directly from CJ Dropshipping
          </p>
        </div>
      </div>

      <div className="flex max-w-2xl gap-4">
        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <Input
            placeholder="Search for products (e.g., 'watch', 'yoga mat')..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <CJProductCard key={product.pid} product={product} />
              ))}
            </div>
          ) : (
            searched && (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <p>No products found for "{keyword}"</p>
              </div>
            )
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="flex h-64 flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Search className="h-12 w-12 mb-4 opacity-20" />
          <p>Enter a keyword to start searching CJ Dropshipping catalog</p>
        </div>
      )}
    </div>
  );
}
