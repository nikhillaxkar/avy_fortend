"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

// 🎨 AVY Fashion Group Palette
const AVY = {
  ink: "#5c2430",        // Deep Burgundy
  inkDark: "#3d1720",    // Dark Burgundy
  accent: "#b5715f",     // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8",      // Warm White
  cardBg: "#fdf2ee",     // Soft Blush Card Background
};

export default function KurtiPromoBanners() {
  return (
    <section className="bg-[#fffaf8] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. EDITORIAL HERO BANNER (Asymmetric Burgundy & Rose Frame) */}
        {/* ========================================================================= */}
        <div 
          className="relative rounded-[2.5rem] text-[#fffaf8] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-2xl min-h-[440px] border border-[#e9c9b8]/30"
          style={{ backgroundColor: AVY.inkDark }}
        >
          {/* Subtle Background Accent Effect */}
          <div 
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: AVY.accent }}
          />

          {/* Left: Campaign Details */}
          <div className="relative z-10 max-w-2xl space-y-6 flex-1 text-center md:text-left">
            <div 
              className="inline-flex items-center gap-2 border backdrop-blur-md text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: "rgba(233, 201, 184, 0.15)", 
                borderColor: "rgba(233, 201, 184, 0.3)",
                color: AVY.accentSoft 
              }}
            >
              <Sparkles size={14} style={{ color: AVY.accentSoft }} />
              HAUTE COUTURE PROMOTION
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.15]">
              Printed & Long Kurtis <br />
              <span className="italic font-light" style={{ color: AVY.accentSoft }}>
                Exclusive 5% to 90% Off
              </span>
            </h2>

            <p className="text-[#fffaf8]/80 text-sm sm:text-base max-w-lg font-normal leading-relaxed">
              Discover hand-loomed patterns, breathable cottons, and royal silhouettes tailored for timeless elegance.
            </p>

            {/* Micro Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {["Pure Cotton", "Floral & Block Prints", "A-Line & Anarkali", "Ready To Ship"].map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-[10px] font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-full border"
                  style={{ 
                    backgroundColor: "rgba(255, 250, 248, 0.05)", 
                    borderColor: "rgba(233, 201, 184, 0.2)",
                    color: AVY.accentSoft 
                  }}
                >
                  ✦ {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Model Showcase & CTA */}
          <div className="relative z-10 flex flex-col items-center md:items-end gap-6 mt-8 md:mt-0 w-full md:w-auto flex-1">
            <div className="relative w-full md:w-[320px] h-[300px] sm:h-[360px] flex items-center justify-center">
              <Image 
                src="/A-Line Kurtis.webp" 
                alt="A-Line Long Printed Kurti"
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                priority
                className="object-contain object-bottom transform hover:scale-105 transition-transform duration-700 filter drop-shadow-2xl"
              />
            </div>

            <Link 
              href="/shop" 
              className="whitespace-nowrap inline-flex items-center gap-3 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-500 shadow-xl group border"
              style={{ 
                backgroundColor: AVY.accentSoft, 
                color: AVY.inkDark,
                borderColor: AVY.accentSoft 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = AVY.white;
                e.currentTarget.style.color = AVY.inkDark;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = AVY.accentSoft;
                e.currentTarget.style.color = AVY.inkDark;
              }}
            >
              Explore Collection
              <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THREE EDITORIAL MINI CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Flared Suits */}
          <div 
            className="rounded-[2.2rem] p-7 flex flex-col justify-between min-h-[320px] relative overflow-hidden group border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ backgroundColor: AVY.cardBg, borderColor: "#efdcd2" }}
          >
            <div className="z-10 space-y-3 max-w-[60%]">
              <span 
                className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border inline-block"
                style={{ backgroundColor: AVY.white, borderColor: AVY.accentSoft, color: AVY.ink }}
              >
                01 // EDITION
              </span>
              <h3 className="text-2xl font-serif font-bold leading-tight" style={{ color: AVY.ink }}>
                Flared & A-Line
              </h3>
              <p className="text-xs leading-relaxed text-[#7a5c56]">
                Gorgeous flares for everyday style & evening gatherings.
              </p>
            </div>

            <div className="z-10 pt-6">
              <Link 
                href="/categories" 
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ color: AVY.ink }}
              >
                Shop Flared <ArrowUpRight size={15} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="absolute -right-2 bottom-0 w-[50%] h-[88%]">
              <Image 
                src="/A-Line Kurtis.webp" 
                alt="Flared A-Line Kurti" 
                fill
                sizes="200px"
                className="object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md" 
              />
            </div>
          </div>

          {/* Card 2: Cotton Floral */}
          <div 
            className="rounded-[2.2rem] p-7 flex flex-col justify-between min-h-[320px] relative overflow-hidden group border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ backgroundColor: AVY.cardBg, borderColor: "#efdcd2" }}
          >
            <div className="z-10 space-y-3 max-w-[60%]">
              <span 
                className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border inline-block"
                style={{ backgroundColor: AVY.white, borderColor: AVY.accentSoft, color: AVY.ink }}
              >
                02 // EDITION
              </span>
              <h3 className="text-2xl font-serif font-bold leading-tight" style={{ color: AVY.ink }}>
                Cotton Floral
              </h3>
              <p className="text-xs leading-relaxed text-[#7a5c56]">
                Breathable pure cottons with vibrant botanical prints.
              </p>
            </div>

            <div className="z-10 pt-6">
              <Link 
                href="/categories" 
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ color: AVY.ink }}
              >
                Shop Floral <ArrowUpRight size={15} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="absolute -right-2 bottom-0 w-[50%] h-[88%]">
              <Image 
                src="/A-Line Kurtis.webp" 
                alt="Cotton Floral Kurti" 
                fill
                sizes="200px"
                className="object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md" 
              />
            </div>
          </div>

          {/* Card 3: Bandhani & Block Prints */}
          <div 
            className="rounded-[2.2rem] p-7 flex flex-col justify-between min-h-[320px] relative overflow-hidden group border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            style={{ backgroundColor: AVY.cardBg, borderColor: "#efdcd2" }}
          >
            <div className="z-10 space-y-3 max-w-[60%]">
              <span 
                className="text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border inline-block"
                style={{ backgroundColor: AVY.white, borderColor: AVY.accentSoft, color: AVY.ink }}
              >
                03 // EDITION
              </span>
              <h3 className="text-2xl font-serif font-bold leading-tight" style={{ color: AVY.ink }}>
                Block Prints
              </h3>
              <p className="text-xs leading-relaxed text-[#7a5c56]">
                Classic ethnic patterns with elegant Dupatta sets.
              </p>
            </div>

            <div className="z-10 pt-6">
              <Link 
                href="/categories" 
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
                style={{ color: AVY.ink }}
              >
                Shop Prints <ArrowUpRight size={15} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="absolute -right-2 bottom-0 w-[50%] h-[88%]">
              <Image 
                src="/A-Line Kurtis.webp" 
                alt="Block Print Kurti Set" 
                fill
                sizes="200px"
                className="object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md" 
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}