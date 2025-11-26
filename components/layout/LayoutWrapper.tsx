// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import MainNav from "./MainNav";
import Footer from "./Footer";
import CartDrawer from "../store/CartDrawer";
import AnnouncementBar from "../store/AnnouncementBar";
import { useEffect, useState } from "react";

// Define types for the data
interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  image_urls: string[] | null;
}

import { Database } from "@/types";

type StoreSettings = Database["public"]["Tables"]["store_settings"]["Row"];

export default function LayoutWrapper({
  children,
  storeSettings,
}: {
  children: React.ReactNode;
  storeSettings: StoreSettings | null;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminDashboard = pathname?.startsWith("/admin");
  const isUserdashboard = pathname?.startsWith("/dashboard");

  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch categories and products for navigation
    async function fetchData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/featured-products"),
        ]);

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
        }

        if (productsRes.ok) {
          const data = await productsRes.json();
          setFeaturedProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch navigation data:", error);
      }
    }

    if (!isAuthPage && !isAdminDashboard && !isUserdashboard) {
      fetchData();
    }
  }, [isAuthPage, isAdminDashboard, isUserdashboard]);

  return (
    <>
      {!isAuthPage && !isUserdashboard && !isAdminDashboard && (
        <>
          <AnnouncementBar />
          <MainNav
            categories={categories}
            featuredProducts={featuredProducts}
            storeSettings={storeSettings}
          />
        </>
      )}
      {children}
      {!isAuthPage && !isUserdashboard && !isAdminDashboard && (
        <Footer storeSettings={storeSettings} />
      )}
      {!isAuthPage && !isUserdashboard && !isAdminDashboard && <CartDrawer />}
    </>
  );
}
