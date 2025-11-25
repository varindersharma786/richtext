"use client";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: "admin" | "user";
}

export default function DashboardLayout({
  children,
  role = "user",
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 flex">
      <DashboardSidebar role={role} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
