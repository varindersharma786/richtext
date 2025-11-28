"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Home,
  Heart,
  User,
  ListFilterPlus,
  Globe,
  Megaphone,
  Image,
  TruckElectric,
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  role: "admin" | "user";
}

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/categories", label: "Categories", icon: ListFilterPlus },
    { href: "/admin/orders", label: "Orders", icon: Package },
    { href: "/admin/dropshipping", label: "Dropshipping", icon: TruckElectric },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/banners", label: "Banners", icon: Image },
    { href: "/admin/seo", label: "SEO", icon: Globe },
    { href: "/admin/blogs", label: "Blogs", icon: Image },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const userLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "My Orders", icon: Package },
    { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-taupe-900 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold text-xl tracking-tight">Asphalte</span>
        </Link>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "text-taupe-900 dark:text-white bg-taupe-50 dark:bg-neutral-800"
                    : "text-gray-500 hover:text-taupe-700 hover:bg-gray-50 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-taupe-50 dark:bg-neutral-800 rounded-xl z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100 dark:border-neutral-800">
        <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
