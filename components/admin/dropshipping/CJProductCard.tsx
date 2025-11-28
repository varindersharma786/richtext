"use client";

import { useState } from "react";
import { CJProduct } from "@/lib/cj-dropshipping";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import { importCJProduct } from "@/app/admin/dropshipping/actions";

interface CJProductCardProps {
  product: CJProduct;
  onView: (product: CJProduct) => void;
}

export default function CJProductCard({ product, onView }: CJProductCardProps) {
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    try {
      const result = await importCJProduct(product);
      if (result.success) {
        toast.success("Product imported successfully!");
      } else {
        toast.error("Failed to import: " + result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <img
          src={product.productImage}
          alt={product.productNameEn}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle
          className="text-sm font-medium line-clamp-2 h-10"
          title={product.productNameEn}
        >
          {product.productNameEn}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grow">
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-primary">
            ${product.sellPrice}
          </span>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
            {product.categoryName}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onView(product)}
        >
          View Product
        </Button>
        <Button
          className="w-full"
          onClick={handleImport}
          disabled={importing}
          variant="secondary"
        >
          {importing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Import to Store
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
