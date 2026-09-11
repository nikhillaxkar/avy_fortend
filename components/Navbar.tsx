"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  Heart,
  User,
  LogOut,
  LogIn,
  Package,
  Home as HomeIcon,
  Grid,
  Store,
} from "lucide-react";

// 🎨 AVY Fashion Group palette (derived from the brand logo)
const AVY = {
  bg: "#fdf2ee", // blush pink background
  bgSoft: "#f7e4dd", // slightly deeper blush (borders / dividers)
  ink: "#5c2430", // deep burgundy — main text/icons
  inkDark: "#3d1720", // darker burgundy — hover state
  accent: "#b5715f", // rose gold — active state / accents
  accentSoft: "#e9c9b8", // pale rose gold — subtle borders
  white: "#fffaf8",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchCountersAndAuth = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoggedIn(false);
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      setIsLoggedIn(true);

      try {
        const cartRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getUserCart`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const cartData = await cartRes.json();
        if (cartData.success && cartData.cart) {
          setCartCount(cartData.cart.products?.length || 0);
        }

        const wishlistRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/getUserWishlist`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const wishlistData = await wishlistRes.json();
        if (wishlistData.success) {
          setWishlistCount(wishlistData.totalWishlistItems || 0);
        }
      } catch (err) {
        console.error("Navbar Dynamic Data Fetch Error: ", err);
      }
    };

    fetchCountersAndAuth();
    const interval = setInterval(fetchCountersAndAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Protected Routes Navigation Handler
  const handleProtectedNavigation = (targetPath: string) => {
    const token = localStorage.getItem("authToken");
    if (!isLoggedIn || !token) {
      router.push("/login");
    } else {
      router.push(targetPath);
    }
  };

  const handleLogoutAction = () => {
    localStorage.removeItem("authToken");
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    setIsOpen(false);
    setCartCount(0);
    setWishlistCount(0);
    router.push("/login");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* 🔹 Top Navbar */}
      <nav
        className="sticky top-0 z-50 border-b shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: `${AVY.bg}f2`,
          borderColor: AVY.accentSoft,
          color: AVY.ink,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 md:h-24">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 transition-colors"
                style={{ color: AVY.ink }}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/avy_logo.png"
                    alt="AVY Fashion Group Logo"
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="hidden lg:flex flex-col leading-none">
                  <span
                    className="font-serif text-2xl tracking-[0.15em]"
                    style={{ color: AVY.ink }}
                  >
                    AVY
                  </span>
                  <span
                    className="text-[10px] tracking-[0.3em] mt-1"
                    style={{ color: AVY.accent }}
                  >
                    Ethnic · Fusion · Everyday
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden md:flex md:gap-6 lg:gap-9 text-[13px] font-medium tracking-[0.15em] uppercase">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative py-1 transition-colors duration-200"
                    style={{ color: active ? AVY.accent : AVY.ink }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.color = AVY.accent;
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.color = AVY.ink;
                    }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px]"
                        style={{ backgroundColor: AVY.accent }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Icons Bar */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5">
              <button
                className="hover:opacity-70 transition-opacity p-1 hidden sm:block"
                style={{ color: AVY.ink }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Desktop User Dropdown */}
              <div className="relative hidden sm:block">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="hover:opacity-70 transition-opacity p-1 flex items-center focus:outline-none"
                      style={{ color: AVY.ink }}
                    >
                      <User
                        size={20}
                        className="rounded-full p-0.5"
                        style={{ border: `1px solid ${AVY.accentSoft}` }}
                      />
                    </button>

                    {showUserDropdown && (
                      <div
                        className="absolute right-0 mt-3 w-48 rounded-xl shadow-xl py-2 z-50 text-[11px] uppercase tracking-wider font-medium border"
                        style={{
                          backgroundColor: AVY.white,
                          borderColor: AVY.accentSoft,
                        }}
                      >
                        <Link
                          href="/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#f7e4dd]"
                          style={{ color: AVY.ink }}
                        >
                          <User size={15} /> My Profile
                        </Link>

                        <Link
                          href="/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#f7e4dd]"
                          style={{ color: AVY.ink }}
                        >
                          <Package size={15} /> My Orders
                        </Link>

                        <button
                          onClick={handleLogoutAction}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-500 hover:bg-[#f7e4dd] transition-colors border-t mt-1 text-left"
                          style={{ borderColor: AVY.accentSoft }}
                        >
                          <LogOut size={15} /> Log Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/login")}
                    className="hover:opacity-70 transition-opacity p-1 block"
                    style={{ color: AVY.ink }}
                  >
                    <LogIn size={20} />
                  </button>
                )}
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={() => handleProtectedNavigation("/wishlist")}
                className="hover:opacity-70 transition-opacity p-1 relative"
                style={{ color: AVY.ink }}
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: AVY.inkDark }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon (Protected) */}
              <button
                onClick={() => handleProtectedNavigation("/cart")}
                className="hover:opacity-70 transition-opacity p-1 relative"
                style={{ color: AVY.ink }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: AVY.accent }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`md:hidden fixed inset-0 z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs p-6 flex flex-col justify-between z-50 border-r"
            style={{ backgroundColor: AVY.bg, borderColor: AVY.accentSoft }}
          >
            <div>
              <div
                className="flex items-center justify-between pb-4 border-b"
                style={{ borderColor: AVY.accentSoft }}
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-11 h-11">
                    <Image
                      src="/avy_logo.png"
                      alt="AVY Fashion Group Logo"
                      fill
                      sizes="44px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span
                      className="font-serif text-sm tracking-[0.15em]"
                      style={{ color: AVY.ink }}
                    >
                      AVY
                    </span>
                    <span
                      className="text-[8px] tracking-[0.25em] mt-0.5"
                      style={{ color: AVY.accent }}
                    >
                      FASHION GROUP
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ color: AVY.ink }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-5 text-sm font-medium tracking-wide uppercase">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      style={{ color: active ? AVY.accent : AVY.ink }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div
              className="pt-6 border-t space-y-4"
              style={{ borderColor: AVY.accentSoft }}
            >
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 uppercase tracking-wider text-sm font-semibold"
                    style={{ color: AVY.ink }}
                  >
                    <User size={17} /> My Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 uppercase tracking-wider text-sm font-semibold"
                    style={{ color: AVY.ink }}
                  >
                    <Package size={17} /> My Orders
                  </Link>
                  <button
                    onClick={handleLogoutAction}
                    className="w-full flex items-center gap-3 text-red-500 uppercase tracking-wider text-sm font-semibold pt-2 border-t text-left"
                    style={{ borderColor: AVY.accentSoft }}
                  >
                    <LogOut size={17} /> Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/login");
                  }}
                  className="flex items-center gap-3 uppercase tracking-wider text-sm font-semibold w-full text-left"
                  style={{ color: AVY.ink }}
                >
                  <LogIn size={17} /> Log In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 Mobile App-Style Bottom Navigation Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t py-2 px-2 shadow-[0_-2px_10px_rgba(92,36,48,0.06)] backdrop-blur-md"
        style={{ backgroundColor: `${AVY.bg}f5`, borderColor: AVY.accentSoft }}
      >
        <div className="flex items-center justify-around">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 transition-colors"
            style={{ color: pathname === "/" ? AVY.accent : "#9c8580" }}
          >
            <HomeIcon size={19} />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Home
            </span>
          </Link>

          <Link
            href="/shop"
            className="flex flex-col items-center gap-1 transition-colors"
            style={{ color: pathname === "/shop" ? AVY.accent : "#9c8580" }}
          >
            <Store size={19} />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Shop
            </span>
          </Link>

          <Link
            href="/categories"
            className="flex flex-col items-center gap-1 transition-colors"
            style={{
              color: pathname === "/categories" ? AVY.accent : "#9c8580",
            }}
          >
            <Grid size={19} />
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Categories
            </span>
          </Link>

          {/* 🔹 Cart Icon (Redirects to Login if not logged in) */}
          <button
            onClick={() => handleProtectedNavigation("/cart")}
            className="flex flex-col items-center gap-1 relative transition-colors"
            style={{ color: pathname === "/cart" ? AVY.accent : "#9c8580" }}
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 right-2 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: AVY.accent }}
              >
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              Cart
            </span>
          </button>

          {/* 🔹 Account / Login Icon */}
          <button
            onClick={() =>
              isLoggedIn ? router.push("/profile") : router.push("/login")
            }
            className="flex flex-col items-center gap-1 transition-colors"
            style={{
              color:
                pathname === "/profile" || pathname === "/login"
                  ? AVY.accent
                  : "#9c8580",
            }}
          >
            {isLoggedIn ? <User size={19} /> : <LogIn size={19} />}
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              {isLoggedIn ? "Account" : "Login"}
            </span>
          </button>
        </div>
      </div>

      {/* Bottom padding spacer so page content doesn't hide behind the mobile bottom bar */}
      <div className="md:hidden h-16" />
    </>
  );
}
