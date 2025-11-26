"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-500">
        Sort by:
      </label>
      <select
        id="sort"
        className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer"
        value={searchParams.get("sort") || "newest"}
        onChange={handleSortChange}
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
