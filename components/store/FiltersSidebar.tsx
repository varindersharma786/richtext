"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function FiltersSidebar({ products }: { products: any[] }) {
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories] = useState<string[]>([]);

  const maxPrice = Math.max(...products.map(p => p.price));

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">Filters</h3>
        <Button variant="ghost" size="icon">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-4">Price Range</h4>
          <Slider
            defaultValue={[0, maxPrice]}
            max={maxPrice}
            step={100}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹0</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold mb-4">Categories</h4>
          <div className="space-y-3">
            {["Electronics", "Fashion", "Home", "Beauty"].map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer">
                <Checkbox />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <h4 className="font-semibold mb-4">Availability</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox defaultChecked />
            <span>In Stock Only</span>
          </label>
        </div>

        <Button className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}