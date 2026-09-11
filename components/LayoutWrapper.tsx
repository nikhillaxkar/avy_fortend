"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Jin routes par Navbar aur Footer HIDE karna hai, unko yahan add karein
  const isExcludedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/payment-gateway");

  return (
    <>
      {!isExcludedRoute && <Navbar />}

      <main className="flex-1">{children}</main>

      {!isExcludedRoute && <Footer />}
    </>
  );
}