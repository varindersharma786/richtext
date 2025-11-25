import ProductCard from "../store/ProductCard";


export default function RelatedProducts({ products }: { products: any[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-32">
      <h2 className="text-4xl font-bold text-center mb-12">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}