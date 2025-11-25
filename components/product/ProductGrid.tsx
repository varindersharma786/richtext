"use client";

import ProductCardAsphalte from "@/components/store/asphalte/ProductCardAsphalte";

interface ProductGridProps {
  products: any[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, i) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <ProductCardAsphalte product={product} />
        </div>
      ))}
    </div>
  );
}
