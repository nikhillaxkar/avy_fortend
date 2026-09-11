"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page par sidebar mat dikhao
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      {/* Responsive layout fix for Mobile, Tablet & Desktop */}
      <main className="w-full flex-1 min-h-screen transition-all duration-300 lg:ml-64 p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}