"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  ShieldCheck,
  Sparkles,
  Truck,
  RefreshCw,
  Star,
  CheckCircle2,
  HeartHandshake,
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

// ==========================================
// 1. TRUST METRICS (Real Value Points)
// ==========================================
const BRAND_METRICS = [
  { id: 1, val: "50,000+", label: "Happy Customers Across India" },
  { id: 2, val: "100%", label: "Pure & Breathable Fabrics" },
  { id: 3, val: "7 Days", label: "Easy Return & Exchange Policy" },
  { id: 4, val: "4.9 ★", label: "Average Customer Rating" },
];

// ==========================================
// 2. TRUST-BUILDING VALUES
// ==========================================
const VALUES_DATA = [
  {
    id: 1,
    icon: <Award size={26} />,
    title: "Uncompromised Quality",
    desc: "Every Kurti is crafted using high-thread-count cotton and premium dye techniques that ensure zero color bleeding and ultimate comfort.",
  },
  {
    id: 2,
    icon: <HeartHandshake size={26} />,
    title: "Direct From Artisans",
    desc: "By removing middleman markups, we bring hand-crafted Jaipuri prints, Chikankari, and Bandhani directly to your doorstep at fair prices.",
  },
  {
    id: 3,
    icon: <ShieldCheck size={26} />,
    title: "100% Secure Shopping",
    desc: "Shop with total peace of mind. We offer encrypted checkout, cash on delivery (COD), and hassle-free door-step return pick-ups.",
  },
];

// ==========================================
// 3. SERVICE HIGHLIGHTS BAR
// ==========================================
const SERVICE_HIGHLIGHTS = [
  {
    icon: <Truck size={20} />,
    title: "Free Express Shipping",
    desc: "On all orders over ₹999",
  },
  {
    icon: <RefreshCw size={20} />,
    title: "Easy 7-Day Returns",
    desc: "No questions asked policy",
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: "100% Original Products",
    desc: "Guaranteed premium fabric",
  },
  {
    icon: <Star size={20} />,
    title: "Trusted Brand",
    desc: "Loved by 50,000+ women",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fffaf8] text-[#5c2430] min-h-screen font-sans antialiased">
      {/* ========================================================================= */}
      {/* SECTION 1: ELEGANT BREADCRUMB HEADER */}
      {/* ========================================================================= */}
      <div className="bg-[#fdf2ee]/60 py-16 px-4 border-b border-[#e9c9b8]/60 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-3">
          <Sparkles size={13} style={{ color: AVY.accent }} />
          <span
            className="text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: AVY.ink }}
          >
            CRAFTED WITH PASSION & PURITY
          </span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-serif font-bold tracking-tight"
          style={{ color: AVY.ink }}
        >
          Our Fashion & Heritage Journey
        </h1>
        <p className="text-[#8c6b63] text-xs mt-3 uppercase tracking-widest font-semibold">
          <Link href="/" className="hover:text-[#5c2430] transition-colors">
            Home
          </Link>{" "}
          / <span style={{ color: AVY.accent }}>About AVY Fashion Group</span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST-BUILDING SERVICE HIGHLIGHTS STRIP */}
      {/* ========================================================================= */}
      <div className="bg-[#5c2430] text-[#fffaf8] py-6 px-4 shadow-md">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          {SERVICE_HIGHLIGHTS.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-3 justify-center md:justify-start"
            >
              <div className="p-2.5 bg-[#3d1720] rounded-xl text-[#e9c9b8]">
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#e9c9b8]/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: BRAND STORY & CRAFTSMANSHIP */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Media Frame with Trust Badge */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[420px] sm:h-[520px] rounded-[2.5rem] overflow-hidden bg-[#fdf2ee] border border-[#e9c9b8] shadow-2xl">
              <Image
                src="/About.jpg"
                alt="AVY Fashion Group Ethnic Collection"
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-[#e9c9b8] hidden sm:flex items-center gap-4 max-w-xs">
              <div
                className="p-3 bg-[#fdf2ee] rounded-full"
                style={{ color: AVY.ink }}
              >
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-[#5c2430]">
                  100% Quality Assurance
                </p>
                <p className="text-xs text-[#8c6b63]">
                  Hand-checked fabrics & durable stitching.
                </p>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="space-y-3">
              <span
                className="text-xs font-bold tracking-widest uppercase block"
                style={{ color: AVY.accent }}
              >
                AUTHENTIC ETHNIC WEAR
              </span>
              <h2
                className="text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-snug"
                style={{ color: AVY.ink }}
              >
                Graceful Kurtis Designed for Modern Elegance & Everyday Comfort
              </h2>
            </div>

            <p className="text-[#6e5048] text-base leading-relaxed">
              At <strong style={{ color: AVY.ink }}>AVY Fashion Group</strong>,
              we believe every piece of clothing should make you feel confident,
              elegant, and completely comfortable. We specialize in bringing
              together traditional Indian textile heritage—from timeless Block
              Prints and Bandhani to delicate embroidery—with modern, functional
              silhouettes.
            </p>

            <p className="text-[#6e5048] text-sm leading-relaxed">
              We carefully source high-grade breathable cotton, silk blends, and
              rich dyes directly from trusted weavers. Every Kurti undergoes
              strict quality inspections for fit, color retention, and seam
              strength before it reaches your hands.
            </p>

            {/* CTA Button */}
            <div className="pt-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 px-8 py-4 text-white text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#3d1720] transition-all shadow-lg group"
                style={{ backgroundColor: AVY.ink }}
              >
                Explore Collection
                <ArrowUpRight
                  size={16}
                  className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: LIVE METRICS (Social Proof) */}
      {/* ========================================================================= */}
      <section className="bg-[#fdf2ee] border-y border-[#e9c9b8]/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {BRAND_METRICS.map((metric) => (
            <div key={metric.id} className="space-y-1">
              <p
                className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight"
                style={{ color: AVY.ink }}
              >
                {metric.val}
              </p>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: AVY.accent }}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: OUR BRAND PROMISE / CORE VALUES */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span
            className="text-xs font-bold tracking-widest uppercase block mb-2"
            style={{ color: AVY.accent }}
          >
            THE AVY GUARANTEE
          </span>
          <h2
            className="text-3xl font-serif font-bold tracking-tight"
            style={{ color: AVY.ink }}
          >
            Why Thousands Trust Our Brand
          </h2>
          <p className="text-[#8c6b63] text-sm mt-2 leading-relaxed">
            We are committed to delivering premium quality ethnic fashion with
            full transparency and reliability.
          </p>
        </div>

        {/* 3 Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUES_DATA.map((value) => (
            <div
              key={value.id}
              className="bg-white border border-[#efdcd2] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#fdf2ee] text-[#5c2430] flex items-center justify-center">
                {value.icon}
              </div>
              <div className="space-y-2">
                <h3
                  className="font-serif font-bold text-lg"
                  style={{ color: AVY.ink }}
                >
                  {value.title}
                </h3>
                <p className="text-[#6e5048] text-xs sm:text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: COMMUNITY & CALL TO ACTION */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto bg-gradient-to-r from-[#5c2430] via-[#3d1720] to-[#5c2430] rounded-[2.5rem] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <span className="text-[#e9c9b8] text-xs font-bold tracking-widest uppercase block">
              JOIN THE AVY FAMILY
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Ready to Upgrade Your Ethnic Wardrobe?
            </h2>
            <p className="text-[#e9c9b8]/80 text-sm leading-relaxed max-w-lg mx-auto">
              Explore our latest collection of A-Line, Anarkali, and daily-wear
              Printed Kurtis with special introductory discounts.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-8 py-4 bg-[#e9c9b8] text-[#5c2430] font-extrabold text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-lg"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/categories"
                className="px-8 py-4 border-2 border-[#e9c9b8]/40 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:border-white transition-all"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
