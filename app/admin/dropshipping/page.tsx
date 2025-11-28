"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { CJProduct } from "@/lib/cj-dropshipping";
import { searchCJProducts } from "./actions";
import CJProductCard from "@/components/admin/dropshipping/CJProductCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

export default function DropshippingPage() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CJProduct[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20; // Default CJ page size

  const handleSearch = async (e?: React.FormEvent, pageOverride?: number) => {
    if (e) e.preventDefault();
    if (!keyword.trim()) return;

    const targetPage = pageOverride || 1;

    setLoading(true);
    setError("");
    setSearched(true);
    if (targetPage === 1) setProducts([]); // Clear only on new search

    try {
      const result = await searchCJProducts(keyword, targetPage);
      if (result.success && result.data) {
        setProducts(result.data.list || []);
        setTotal(result.data.total || 0);
        setPage(targetPage);
      } else {
        setError(result.error || "Failed to fetch products");
        setProducts([]);
        setTotal(0);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    handleSearch(undefined, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / pageSize);

  const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(
    null
  );
  const [importing, setImporting] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleViewProduct = (product: CJProduct) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
  };

  const handleImportFromPopup = async () => {
    if (!selectedProduct) return;
    setImporting(true);
    try {
      const { importCJProduct } = await import("./actions");
      const result = await importCJProduct(selectedProduct);
      if (result.success) {
        toast.success("Product imported successfully!");
        handleClosePopup();
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
    <div className="space-y-8 relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CJ Dropshipping</h1>
          <p className="text-muted-foreground">
            Search and import products directly from CJ Dropshipping
          </p>
        </div>
      </div>

      <div className="flex max-w-2xl gap-4">
        <form
          onSubmit={(e) => handleSearch(e, 1)}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Search for products (e.g., 'watch', 'yoga mat')..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Search</span>
          </Button>
        </form>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <CJProductCard
                    key={product.pid}
                    product={product}
                    onView={handleViewProduct}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-4 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            searched && (
              <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                <p>No products found for "{keyword}"</p>
              </div>
            )
          )}
        </>
      )}

      {!searched && !loading && (
        <div className="flex h-64 flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Search className="h-12 w-12 mb-4 opacity-20" />
          <p>Enter a keyword to start searching CJ Dropshipping catalog</p>
        </div>
      )}

      {/* Product Detail Popup */}
      {isPopupOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b flex justify-between items-start">
              <h2 className="text-xl font-bold pr-8">
                {selectedProduct.productNameEn}
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={selectedProduct.productImage}
                  alt={selectedProduct.productNameEn}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedProduct.sellPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg">{selectedProduct.categoryName}</p>
                </div>
              </div>
              {/* Add more details here if available in CJProduct type */}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button variant="outline" onClick={handleClosePopup}>
                Cancel
              </Button>
              <Button onClick={handleImportFromPopup} disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import to Store"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
