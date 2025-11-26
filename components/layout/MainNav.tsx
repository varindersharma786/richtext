"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShoppingCart, User, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Database } from "@/types";

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

export default function MainNav({
  categories = [],
  featuredProducts = [],
  storeSettings,
}: {
  categories?: Category[];
  featuredProducts?: Product[];
  storeSettings?: Database["public"]["Tables"]["store_settings"]["Row"] | null;
}) {
  const pathname = usePathname();
  const { totalItems, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {storeSettings?.logo_url ? (
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src={storeSettings.logo_url}
                  alt={storeSettings.store_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-900 rounded-lg" />
            )}
            <span className="font-bold text-xl text-gray-900">
              {storeSettings?.store_name || "YourStore"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/" && "bg-gray-100 font-semibold"
                  )}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Categories Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/categories"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gray-900 p-6 no-underline outline-none focus:shadow-md hover:shadow-lg transition-all"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-white">
                            Browse All Categories
                          </div>
                          <p className="text-sm leading-tight text-gray-300">
                            Explore our complete collection organized by
                            category
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <div className="grid gap-2">
                      {categories.slice(0, 4).map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-gray-900"
                        >
                          <div className="flex items-center gap-3">
                            {category.image_url && (
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={category.image_url}
                                  alt={category.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium leading-none group-hover:text-gray-900">
                                {category.name}
                              </div>
                              <p className="line-clamp-1 text-xs leading-snug text-gray-500 mt-1">
                                Shop {category.name.toLowerCase()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Products Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] p-6">
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Featured Products
                      </h4>
                      <p className="text-xs text-gray-500">
                        Handpicked selections just for you
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {featuredProducts.slice(0, 6).map((product) => {
                        const imageUrl =
                          product.image_urls?.[0] || product.image_url;
                        return (
                          <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group block space-y-2"
                          >
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  No image
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium line-clamp-1 group-hover:text-gray-700 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                ₹{product.price.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-6 pt-4 border-t">
                      <Link
                        href="/products"
                        className="text-sm font-medium text-gray-900 hover:text-gray-700"
                      >
                        View all products →
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/about" && "bg-gray-100 font-semibold"
                  )}
                >
                  <Link href="/about">About</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    pathname === "/contact" && "bg-gray-100 font-semibold"
                  )}
                >
                  <Link href="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* User Icon */}
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems()}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 hover:bg-gray-100 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
