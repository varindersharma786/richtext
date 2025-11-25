// components/layout/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import CartDrawer from "@/components/store/CartDrawer";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className={`font-bold text-2xl ${scrolled ? "text-gray-900" : "text-white"}`}>
                ShopFlow
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-10">
              {["Products", "Categories", "Sale", "About"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={`font-medium transition-colors ${
                    scrolled ? "text-gray-700 hover:text-purple-600" : "text-white hover:text-purple-300"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </nav>

            {/* Right Side: Search + Cart + Profile */}
            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`${scrolled ? "text-gray-700" : "text-white"} hover:bg-white/20`}
                >
                  <Search className="w-6 h-6" />
                </Button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b">
                        <Input
                          placeholder="Search products..."
                          className="h-12 text-lg border-none focus:ring-0"
                          autoFocus
                        />
                      </div>
                      <div className="p-4 text-center text-gray-500">
                        Type to search products...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <Button variant="ghost" size="icon" className={`${scrolled ? "text-gray-700" : "text-white"} hover:bg-white/20`}>
                <Avatar className="w-9 h-9">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className={`relative ${scrolled ? "text-gray-700" : "text-white"} hover:bg-white/20`}
                onClick={() => setIsOpen(true)}
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {totalItems()}
                  </motion.span>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className={scrolled ? "text-gray-700" : "text-white"}>
                    <Menu className="w-7 h-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-8 mt-10">
                    {["Products", "Categories", "Sale", "About", "Contact"].map((item) => (
                      <Link
                        key={item}
                        href={`/${item.toLowerCase()}`}
                        className="text-2xl font-medium text-gray-800 hover:text-purple-600 transition"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}