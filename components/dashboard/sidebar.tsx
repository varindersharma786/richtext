"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  PenTool,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-foreground">My Account</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <LayoutDashboard size={20} />
          Overview
        </Link>

        <Link
          href="/dashboard/subscription"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard/subscription")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <CreditCard size={20} />
          Subscription
        </Link>

        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard/settings")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <Settings size={20} />
          Settings
        </Link>

        <Link
          href="/dashboard/signature"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive("/dashboard/signature")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <PenTool size={20} />
          Signature Builder
        </Link>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <form action="/auth/signout" method="post">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
