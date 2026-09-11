"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Mobile Drawer Toggle State
  const [isOpen, setIsOpen] = useState(false);

  // FIXED: Explicitly defined type string | null
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Route change hone par mobile sidebar auto-close aur matching dropdown auto-open karne ke liye
  useEffect(() => {
    setIsOpen(false);

    if (pathname.startsWith("/admin/products")) {
      setOpenDropdown("Products");
    } else if (pathname.startsWith("/admin/categories")) {
      setOpenDropdown("Categories");
    } else {
      setOpenDropdown(null);
    }
  }, [pathname]);

  // FIXED: Parameter typed as string
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Logout Handler - Clears adminToken cookie & redirects to login
  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
    router.refresh();
  };

  const menus = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
      isDropdown: true,
      subMenus: [
        { name: "All Products", href: "/admin/products" },
        { name: "Add Product", href: "/admin/products/add-product" },
      ],
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: Package,
      isDropdown: true,
      subMenus: [
        { name: "All Categories", href: "/admin/categories" },
        { name: "Add Categories", href: "/admin/categories/add-categories" },
      ],
    },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header (Visible only on screens below lg breakpoint) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-900 text-white flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold tracking-wide">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-900 rounded-lg transition"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Backdrop Overlay for Mobile/Tablet Drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`w-64 h-screen bg-black text-white fixed left-0 top-0 border-r border-gray-900 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header Section */}
        <div>
          <div className="p-6 border-b border-gray-900 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const isDropdownOpen = openDropdown === menu.name;
              const isMainActive = menu.isDropdown
                ? pathname.startsWith(menu.href)
                : pathname === menu.href;

              if (menu.isDropdown) {
                return (
                  <div key={menu.name} className="space-y-1">
                    {/* Dropdown Toggle Header */}
                    <button
                      onClick={() => toggleDropdown(menu.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition ${
                        isMainActive && !isDropdownOpen
                          ? "bg-white text-black"
                          : "hover:bg-gray-900 text-gray-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={20}
                          className={
                            isMainActive && !isDropdownOpen
                              ? "text-black"
                              : "text-gray-400"
                          }
                        />
                        <span className="font-medium text-sm">{menu.name}</span>
                      </div>
                      {isDropdownOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {/* Sub Menu Links */}
                    {isDropdownOpen && (
                      <div className="pl-9 space-y-1 transition-all duration-300">
                        {menu.subMenus?.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`flex items-center p-2.5 rounded-lg text-sm transition ${
                                isSubActive
                                  ? "bg-white text-black font-semibold"
                                  : "text-gray-400 hover:text-white hover:bg-gray-900"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              {/* Standard Links */}
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`flex items-center gap-3 p-3 rounded-xl transition ${
                    isMainActive
                      ? "bg-white text-black font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-gray-900"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isMainActive ? "text-black" : "text-gray-400"}
                  />
                  <span className="font-medium text-sm">{menu.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Section: Logout */}
        <div className="p-4 border-t border-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}