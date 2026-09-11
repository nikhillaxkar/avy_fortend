"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, ChevronDown, ArrowUpRight } from "lucide-react";

interface Size {
  size: string;
  stock: number;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  sizes: Size[];
  isPremium: boolean;
  isOnSale: boolean;
}

// 🎨 AVY Fashion Group palette (derived from the brand logo)
const AVY = {
  ink: "#5c2430",        // deep burgundy — headings, buttons
  inkDark: "#3d1720",    // hover state for burgundy elements
  accent: "#b5715f",     // rose gold — accents, price, highlights
  accentSoft: "#e9c9b8", // pale rose gold — borders
  white: "#fffaf8",
};

export default function HeroSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Soft premium background colors rotation system — blush/rose tinted
  const bgColors = [
    "bg-[#fdf2ee]", // blush pink
    "bg-[#f7ece5]", // warm sand
    "bg-[#f3e6df]", // deeper blush
    "bg-[#f6ecec]", // muted rose
  ];

  // =========================================================================
  // SAFE FRONTEND-FILTERED API FETCH SYSTEM
  // =========================================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`);
        const data = await response.json();

        if (data.success && data.products && data.products.length > 0) {
          const saleItems = data.products.filter((p: Product) => p.isOnSale === true);

          if (saleItems.length > 0) {
            setProducts(saleItems.slice(0, 5));
          } else {
            setProducts(data.products.slice(0, 5));
          }
        }
      } catch (err) {
        console.error("Hero Slider API Bridge Error: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto slide effect: Har 6 second me change hoga
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [products]);

  const nextSlide = () => {
    if (products.length === 0) return;
    setCurrent((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setCurrent((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <section className="bg-[#fffaf8] py-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="w-full bg-[#fdf2ee] border border-[#e9c9b8] rounded-[2.5rem] h-[500px] md:h-[600px] animate-pulse" />
      </section>
    );
  }

  if (products.length === 0) return null;

  const activeProduct = products[current];
  const nextProduct = products[(current + 1) % products.length];

  const activeImage = activeProduct.images && activeProduct.images.length > 0 ? activeProduct.images[0] : "/avy_logo.png";
  const nextImage = nextProduct.images && nextProduct.images.length > 0 ? nextProduct.images[0] : "/avy_logo.png";

  return (
    <section className="bg-[#fffaf8] py-4 sm:py-6 px-3 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative flex gap-4 sm:gap-6">

        {/* --- MAIN ACTIVE SLIDE BANNER --- */}
        <div
          className={`w-full md:w-[70%] ${bgColors[current % bgColors.length]} rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between min-h-[520px] sm:min-h-[550px] md:h-[600px] transition-all duration-500 relative border border-[#efdcd2]`}
        >
          {/* Text Content */}
          <div className="flex-1 max-w-xl z-10 space-y-3 sm:space-y-5 order-2 md:order-1 text-center md:text-left">
            <span
              className="font-bold tracking-[0.2em] uppercase text-[11px] sm:text-sm block"
              style={{ color: AVY.accent }}
            >
              {activeProduct.isOnSale ? "Special Sale" : "Featured Collection"} · {activeProduct.category}
            </span>
            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-serif leading-[1.2] line-clamp-2"
              style={{ color: AVY.ink }}
            >
              {activeProduct.title}
            </h1>
            <p className="text-[#7a5c56] text-sm sm:text-base font-medium line-clamp-2 max-w-md mx-auto md:mx-0">
              {activeProduct.description}
            </p>
            <div className="text-base sm:text-lg font-medium" style={{ color: AVY.ink }}>
              Price{" "}
              <span
                className="font-bold text-xl sm:text-3xl ml-1"
                style={{ color: AVY.accent }}
              >
                ₹{activeProduct.discountPrice || activeProduct.price}
              </span>
              {activeProduct.discountPrice && activeProduct.discountPrice < activeProduct.price && (
                <span className="text-xs sm:text-sm text-[#b39b95] line-through ml-2">₹{activeProduct.price}</span>
              )}
            </div>

            {/* Premium Button */}
            <div className="pt-2">
              <Link
                href={`/product/${activeProduct._id}`}
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border font-semibold text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 group"
                style={{
                  borderColor: AVY.ink,
                  color: AVY.ink,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = AVY.ink;
                  e.currentTarget.style.color = AVY.white;
                  e.currentTarget.style.borderColor = AVY.ink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = AVY.ink;
                  e.currentTarget.style.borderColor = AVY.ink;
                }}
              >
                View Details
                <ArrowUpRight
                  size={16}
                  className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* Image Container - Fixed for Mobile view */}
          <div className="flex-1 w-full h-[220px] sm:h-[320px] md:h-full relative mb-4 md:mb-0 order-1 md:order-2 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={activeImage}
                alt={activeProduct.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="transition-transform duration-700 ease-out hover:scale-105 object-contain p-0 sm:p-4"
                unoptimized={activeImage.startsWith("http")}
              />
            </div>
          </div>

          {/* Slider Navigation Vertical Buttons */}
          {products.length > 1 && (
            <div className="absolute right-3 bottom-3 md:bottom-auto md:top-1/2 md:-translate-y-1/2 flex flex-col gap-2 z-20">
              <button
                onClick={prevSlide}
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 border rounded-full flex items-center justify-center transition-colors shadow-md"
                style={{ borderColor: AVY.accentSoft, color: AVY.ink }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = AVY.ink;
                  e.currentTarget.style.color = AVY.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.95)";
                  e.currentTarget.style.color = AVY.ink;
                }}
                aria-label="Previous slide"
              >
                <ChevronUp size={18} />
              </button>
              <button
                onClick={nextSlide}
                type="button"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white/95 border rounded-full flex items-center justify-center transition-colors shadow-md"
                style={{ borderColor: AVY.accentSoft, color: AVY.ink }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = AVY.ink;
                  e.currentTarget.style.color = AVY.white;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.95)";
                  e.currentTarget.style.color = AVY.ink;
                }}
                aria-label="Next slide"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          )}

          {/* Slide progress dots (mobile-friendly indicator) */}
          {products.length > 1 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 md:hidden flex gap-1.5 z-20">
              {products.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "18px" : "6px",
                    backgroundColor: i === current ? AVY.accent : AVY.accentSoft,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- NEXT SLIDE PREVIEW CARD (Desktop Only) --- */}
        {products.length > 1 && (
          <div className="hidden md:flex md:w-[30%] bg-[#fdf2ee] rounded-[2.5rem] p-8 flex-col justify-between opacity-95 relative overflow-hidden group border border-[#efdcd2]">
            <div className="relative z-10 space-y-3">
              <span
                className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1"
                style={{ color: AVY.accent }}
              >
                Up Next
              </span>
              <h3
                className="text-lg font-serif line-clamp-2"
                style={{ color: AVY.ink }}
              >
                {nextProduct.title}
              </h3>
            </div>

            {/* Next Slide Mini Image */}
            <div className="w-full h-[300px] relative mt-auto">
              <Image
                src={nextImage}
                alt="Next preview"
                fill
                sizes="25vw"
                className="opacity-90 group-hover:scale-105 transition-transform duration-500 object-contain p-4"
                unoptimized={nextImage.startsWith("http")}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}