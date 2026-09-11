"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Sparkles, Folder } from "lucide-react";

// 🎨 AVY Fashion Palette Constants
const AVY = {
  ink: "#5c2430",        // Deep Burgundy
  inkDark: "#3d1720",    // Dark Burgundy
  accent: "#b5715f",     // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8",      // Warm White
  cardBg: "#fdf2ee",     // Soft Blush Card Background
};

// TypeScript Interface Configuration matching backend categories structure
interface Category {
  _id: string;
  name: string;
  image: string;
  totalItems: number;
  description: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // =========================================================================
  // LIVE DATABASE CATEGORIES FETCH
  // =========================================================================
  useEffect(() => {
    const fetchLiveCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/categories`);
        const data = await response.json();

        if (data.success && data.categories) {
          setCategories(data.categories);
        } else {
          setError("Categories database data fetch karne me issue aaya hai.");
        }
      } catch (err) {
        console.error("Categories Page Sync Error: ", err);
        setError("Backend server down hai ya API endpoint unreachable hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveCategories();
  }, []);

  return (
    <div className="bg-[#fffaf8] text-[#5c2430] min-h-screen font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* PAGE HEADER / BREADCRUMB BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#fdf2ee]/60 py-12 sm:py-16 px-4 border-b border-[#e9c9b8]/60 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-3">
          <Sparkles size={13} style={{ color: AVY.accent }} />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: AVY.ink }}>
            AVY FASHION CATALOG
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: AVY.ink }}>
          Shop By Categories
        </h1>
        <p className="text-[#8c6b63] text-xs sm:text-sm max-w-md mx-auto mt-3 font-medium">
          Explore our signature ethnic ensembles, handcrafted kurtis, and designer suits tailored for timeless luxury.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC ERROR NOTIFICATION ALERT */}
      {/* ========================================================================= */}
      {error && (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="p-4 bg-red-50 text-red-700 border border-red-100 text-xs sm:text-sm font-semibold rounded-2xl">
            {error}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CATEGORIES GRID LAYOUT */}
      {/* ========================================================================= */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* SHIMMER LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, idx) => (
              <div 
                key={idx} 
                className="bg-[#fdf2ee] border border-[#efdcd2] rounded-[2rem] h-[460px] animate-pulse" 
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-white rounded-3xl border border-[#efdcd2] max-w-lg mx-auto p-8 shadow-xs">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#fdf2ee] flex items-center justify-center text-[#b5715f]">
              <Folder size={28} />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#5c2430]">No Categories Found</h3>
            <p className="text-xs text-[#8c6b63] mt-2">
              Currently no active product categories exist in the store catalog.
            </p>
          </div>
        ) : (
          /* CATEGORIES CARD GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => {
              // Fallback Banner Image handling
              const targetBanner = category.image || "/image_474d81.png";
              const displayTag = category.isFeatured ? "Featured" : "Collection";

              return (
                <div 
                  key={category._id} 
                  className="group bg-white rounded-[2rem] border border-[#efdcd2] shadow-xs hover:shadow-xl hover:border-[#b5715f]/40 transition-all duration-500 overflow-hidden flex flex-col h-[460px] sm:h-[480px] relative"
                >
                  
                  {/* Image Banner Section */}
                  <div className="relative w-full h-[62%] sm:h-[65%] bg-[#fdf2ee] overflow-hidden">
                    {/* Badge */}
                    <span className="absolute top-4 left-4 z-20 bg-[#5c2430] text-[#e9c9b8] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                      {displayTag}
                    </span>

                    {/* Category Image */}
                    <Image
                      src={targetBanner}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      unoptimized={targetBanner.startsWith("http")}
                    />
                    
                    {/* Dark Luxury Vignette Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3d1720]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info Content Section */}
                  <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-white relative z-10">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold font-serif text-[#5c2430] group-hover:text-[#b5715f] transition-colors capitalize truncate">
                          {category.name}
                        </h2>
                        <span className="text-[11px] font-bold text-[#8c6b63] bg-[#fdf2ee] px-2.5 py-1 rounded-md border border-[#efdcd2] shrink-0">
                          {category.totalItems || 0} Items
                        </span>
                      </div>
                      <p className="text-[#8c6b63] text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {category.description || "Explore signature handcrafted ethnic wear designed for elegance."}
                      </p>
                    </div>

                    {/* Interactive Bottom CTA Link */}
                    <div className="pt-4 border-t border-[#fdf2ee] flex items-center justify-between">
                      <Link 
                        href={`/shop?category=${encodeURIComponent(category.name)}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#5c2430] group-hover:text-[#b5715f] transition-colors"
                      >
                        Explore Collection
                        <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                      
                      {/* Interactive Shopping Bag Icon Badge */}
                      <div className="w-8 h-8 rounded-full bg-[#fdf2ee] text-[#b5715f] flex items-center justify-center group-hover:bg-[#5c2430] group-hover:text-[#e9c9b8] transition-all duration-300 shadow-xs">
                        <ShoppingBag size={14} />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}