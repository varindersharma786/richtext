// components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../layout/Navbar";
import Footer from "../footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");
  const isAdminDashboard = pathname?.startsWith("/admin");
  const isUserdashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isAuthPage && !isUserdashboard && !isAdminDashboard && <Navbar />}
      {children}
      {!isAuthPage && !isUserdashboard && !isAdminDashboard && <Footer />}
    </>
  );
}
