// app/(admin)/products/new/page.tsx
import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>
      <ProductForm />
    </div>
  );
}