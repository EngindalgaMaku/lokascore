"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  // Admin sayfalarında header ve footer'ı gizle
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
