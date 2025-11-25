"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";

export default function MobileFilters({ products }: { products: any[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full h-14 text-lg">
          <Filter className="mr-2" />
          Filters & Sort
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-96">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <FiltersSidebar products={products} />
        </div>
      </SheetContent>
    </Sheet>
  );
}