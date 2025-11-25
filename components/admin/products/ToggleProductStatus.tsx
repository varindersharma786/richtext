// components/admin/products/ToggleProductStatus.tsx
"use client";

import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useTransition } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ToggleProductStatus({ product }: { product: any }) {
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const toggleStatus = () => {
    startTransition(async () => {
      await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id);
    });
  };

  return (
    <Button
      variant={product.is_active ? "default" : "secondary"}
      size="sm"
      onClick={toggleStatus}
      disabled={isPending}
      className="h-8 w-28"
    >
      {product.is_active ? (
        <>
          <ToggleRight className="mr-2 h-4 w-4" />
          Active
        </>
      ) : (
        <>
          <ToggleLeft className="mr-2 h-4 w-4" />
          Inactive
        </>
      )}
    </Button>
  );
}