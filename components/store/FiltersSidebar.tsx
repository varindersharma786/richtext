"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export default function FiltersSidebar({ products }: { products: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPrice = Math.max(...products.map((p) => p.price), 10000);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Initialize state from URL
  useEffect(() => {
    const min = Number(searchParams.get("min_price")) || 0;
    const max = Number(searchParams.get("max_price")) || maxPrice;
    setPriceRange([min, max]);

    const cats = searchParams.get("categories")?.split(",") || [];
    setSelectedCategories(cats);

    setInStockOnly(searchParams.get("in_stock") === "true");
  }, [searchParams, maxPrice]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("min_price", priceRange[0].toString());
    params.set("max_price", priceRange[1].toString());

    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    } else {
      params.delete("categories");
    }

    if (inStockOnly) {
      params.set("in_stock", "true");
    } else {
      params.delete("in_stock");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    router.push("/products");
    setPriceRange([0, maxPrice]);
    setSelectedCategories([]);
    setInStockOnly(false);
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-900 sticky top-24">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-neutral-800">
        <h3 className="text-sm uppercase tracking-widest font-medium">
          Filters
        </h3>
        <button
          onClick={handleClearFilters}
          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-8">
        {/* Price Range */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium mb-4">
            Price Range
          </h4>
          <Slider
            value={priceRange}
            max={maxPrice}
            step={100}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium mb-4">
            Categories
          </h4>
          <div className="space-y-3">
            {["Electronics", "Fashion", "Home", "Beauty"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer text-sm hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Checkbox
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium mb-4">
            Availability
          </h4>
          <label className="flex items-center gap-3 cursor-pointer text-sm hover:text-gray-900 dark:hover:text-white transition-colors">
            <Checkbox
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        <button
          onClick={handleApplyFilters}
          className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 uppercase tracking-widest text-xs font-medium transition-all rounded-none"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
