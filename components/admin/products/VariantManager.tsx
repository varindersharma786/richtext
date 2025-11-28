"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductVariant } from "@/types/product-variant";

interface VariantManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  basePrice: number;
}

export default function VariantManager({
  variants,
  onVariantsChange,
  basePrice,
}: VariantManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductVariant>({
    variant_name: "",
    sku: "",
    price_adjustment: 0,
    stock: 0,
    image_url: null,
    sort_order: variants.length,
    is_active: true,
  });

  const handleOpenDialog = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setFormData(variants[index]);
    } else {
      setEditingIndex(null);
      setFormData({
        variant_name: "",
        sku: "",
        price_adjustment: 0,
        stock: 0,
        image_url: null,
        sort_order: variants.length,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveVariant = () => {
    const newVariants = [...variants];
    if (editingIndex !== null) {
      newVariants[editingIndex] = formData;
    } else {
      newVariants.push(formData);
    }
    onVariantsChange(newVariants);
    setIsDialogOpen(false);
  };

  const handleDeleteVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Product Variants</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {variants.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {variant.variant_name}
                  </TableCell>
                  <TableCell>{variant.sku}</TableCell>
                  <TableCell>
                    ₹{(basePrice + variant.price_adjustment).toFixed(2)}
                    {variant.price_adjustment !== 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({variant.price_adjustment > 0 ? "+" : ""}
                        {variant.price_adjustment})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{variant.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(index)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteVariant(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No variants added yet. Add variants like different sizes, colors,
            etc.
          </p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit Variant" : "Add Variant"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="variant_name">Variant Name *</Label>
                <Input
                  id="variant_name"
                  placeholder="e.g., Large - Blue"
                  value={formData.variant_name}
                  onChange={(e) =>
                    setFormData({ ...formData, variant_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  placeholder="e.g., PROD-LG-BL"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="price_adjustment">Price Adjustment (₹)</Label>
                <Input
                  id="price_adjustment"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price_adjustment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_adjustment: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Final price: ₹
                  {(basePrice + formData.price_adjustment).toFixed(2)}
                </p>
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveVariant}
                disabled={!formData.variant_name || !formData.sku}
              >
                Save Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
