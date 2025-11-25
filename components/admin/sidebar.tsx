"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  PlusCircle,
  Users,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/admin/products"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/products")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <PlusCircle size={20} />
          Products
        </Link>
        <Link
          href="/admin/users"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/users")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Users size={20} />
          Users
        </Link>

        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Blog
        </div>

        <Link
          href="/admin/posts"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/posts")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <FileText size={20} />
          All Posts
        </Link>

        <Link
          href="/admin/posts/new"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/posts/new")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <PlusCircle size={20} />
          New Post
        </Link>

        <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          System
        </div>

        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/admin/settings")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-800">
        <form action="/auth/signout" method="post">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
