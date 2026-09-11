"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// 🎨 AVY Fashion Palette
const AVY = {
  ink: "#5c2430", // Deep Burgundy
  inkDark: "#3d1720", // Dark Burgundy
  accent: "#b5715f", // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8", // Warm White
  cardBg: "#fdf2ee", // Soft Blush Card Background
};

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Newsletter submission logic
  };

  return (
    <footer className="bg-[#fffaf8] text-[#5c2430] border-t border-[#e9c9b8]/60 pt-16 pb-8 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ========================================================================= */}
        {/* 1. BRAND TRUST BADGES BAR                                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#e9c9b8]/50">
          <div className="flex items-center gap-4 bg-[#fdf2ee]/70 p-5 rounded-2xl border border-[#efdcd2]">
            <div className="w-11 h-11 rounded-xl bg-[#5c2430] text-[#e9c9b8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Truck size={20} />
            </div>
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: AVY.ink }}
              >
                Pan-India Shipping
              </h4>
              <p className="text-[11px] text-[#8c6b63]">
                Fast & reliable delivery across India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#fdf2ee]/70 p-5 rounded-2xl border border-[#efdcd2]">
            <div className="w-11 h-11 rounded-xl bg-[#5c2430] text-[#e9c9b8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: AVY.ink }}
              >
                100% Genuine Quality
              </h4>
              <p className="text-[11px] text-[#8c6b63]">
                Authentic fabrics & craftsmanship
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#fdf2ee]/70 p-5 rounded-2xl border border-[#efdcd2]">
            <div className="w-11 h-11 rounded-xl bg-[#5c2430] text-[#e9c9b8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: AVY.ink }}
              >
                Easy Support
              </h4>
              <p className="text-[11px] text-[#8c6b63]">
                Hassle-free query response team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#fdf2ee]/70 p-5 rounded-2xl border border-[#efdcd2]">
            <div className="w-11 h-11 rounded-xl bg-[#5c2430] text-[#e9c9b8] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Lock size={20} />
            </div>
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: AVY.ink }}
              >
                Secure Checkout
              </h4>
              <p className="text-[11px] text-[#8c6b63]">
                Encrypted payment processing
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN FOOTER CONTENT GRID                                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#e9c9b8]/50">
          {/* Column 1: Brand Info & GST Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/avy_logo.png"
                  alt="AVY Fashion Group Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span
                  className="text-xl font-bold tracking-[0.25em] uppercase font-serif block leading-none"
                  style={{ color: AVY.ink }}
                >
                  AVY
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#8c6b63]">
                  Ethnic • Fusion • Everyday
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#7a5c56] leading-relaxed pr-4">
              AVY Fashion Group offers high-grade ethnic apparel designed with
              modern aesthetics and traditional perfection. Proprietorship by
              Shivraj Sain.
            </p>

            {/* GST Details Box */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-3 bg-[#fdf2ee] px-4 py-2.5 rounded-xl border border-[#e9c9b8]/80 shadow-sm">
                <ShieldCheck size={18} style={{ color: AVY.accent }} />
                <div className="text-[11px]">
                  <span className="text-[#8c6b63] block uppercase tracking-wider text-[9px] font-bold">
                    GSTIN Registered
                  </span>
                  <span
                    className="font-mono font-bold tracking-wide"
                    style={{ color: AVY.ink }}
                  >
                    08NRQPS4560N1ZG
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: AVY.ink }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-[#7a5c56]">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  About AVY
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: AVY.ink }}
            >
              Policies & Support
            </h3>
            <ul className="space-y-2.5 text-xs font-medium text-[#7a5c56]">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-policy"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="hover:text-[#5c2430] hover:underline transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Reach Us / Registered Address (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: AVY.ink }}
            >
              Official Support
            </h3>

            <div className="space-y-3 text-xs text-[#7a5c56]">
              <div className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: AVY.accent }}
                />
                <span className="leading-relaxed">
                  NEAR MAIN MARKET, NEWAII - 304022, RAJASTHAN
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: AVY.accent }}
                />
                <a
                  href="tel:+916376743470"
                  className="hover:text-[#5c2430] transition-colors font-mono"
                >
                  +91 6376743470
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={16}
                  className="flex-shrink-0"
                  style={{ color: AVY.accent }}
                />
                <a
                  href="mailto:stylehubcollection63@gmail.com"
                  className="hover:text-[#5c2430] transition-colors break-all"
                >
                  stylehubcollection63@gmail.com
                </a>
              </div>
            </div>

            {/* Newsletter Input Box */}
            <div className="pt-2">
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-2"
                style={{ color: AVY.ink }}
              >
                Join AVY Club
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex items-center"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#fdf2ee] border border-[#e9c9b8] rounded-l-xl px-3.5 py-2.5 text-xs text-[#5c2430] placeholder-[#8c6b63]/70 focus:outline-none focus:border-[#5c2430] w-full"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-r-xl transition-colors flex items-center justify-center text-[#fffaf8]"
                  style={{ backgroundColor: AVY.ink }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. COPYRIGHT & BOTTOM LEGAL STATEMENT                                     */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8c6b63] gap-4">
          <p>
            © {new Date().getFullYear()} AVY Fashion Group. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-3 font-medium">
            <Link
              href="/privacy-policy"
              className="hover:text-[#5c2430] transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms-and-conditions"
              className="hover:text-[#5c2430] transition-colors"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              href="/refund-policy"
              className="hover:text-[#5c2430] transition-colors"
            >
              Refunds
            </Link>
            <span>•</span>
            <Link
              href="/shipping-policy"
              className="hover:text-[#5c2430] transition-colors"
            >
              Shipping
            </Link>
          </div>

          <p className="text-center sm:text-right">
            Operated by{" "}
            <span className="font-bold" style={{ color: AVY.ink }}>
              Shivraj Sain
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
