"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// TypeScript Type Configuration matching your backend JSON
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

// 🎨 AVY Fashion Group Palette
const AVY = {
  ink: "#5c2430", // deep burgundy — text & main highlights
  inkDark: "#3d1720", // hover state burgundy
  accent: "#b5715f", // rose gold — subtext/accents
  accentSoft: "#e9c9b8", // pale rose gold — borders/light backgrounds
  white: "#fffaf8",
};

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // =========================================================================
  // LIVE API FETCH EFFECT
  // =========================================================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/categories`,
        );
        const data = await response.json();

        if (data.success && data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setActiveTab(data.categories[0]._id);
          }
        } else {
          setError("Categories load karne mein dikkat aayi.");
        }
      } catch (err) {
        console.error("Categories API Error: ", err);
        setError("Backend server down hai ya connected nahi hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="bg-[#fffaf8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Title */}
        <div className="mb-8">
          <span
            className="font-bold tracking-[0.2em] uppercase text-xs sm:text-sm block mb-1"
            style={{ color: AVY.accent }}
          >
            Collections
          </span>
          <h2
            className="text-2xl sm:text-4xl font-bold tracking-tight font-serif"
            style={{ color: AVY.ink }}
          >
            Shop By Category
          </h2>
          <p className="text-[#7a5c56] text-sm mt-1">
            Discover our curated live collections
          </p>
        </div>

        {/* API Error Notification */}
        {error && (
          <div className="p-4 mb-6 bg-[#fdf2ee] text-[#5c2430] border border-[#e9c9b8] text-sm font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl h-20 animate-pulse"
              />
            ))}
          </div>
        ) : (
          /* --- DYNAMIC CATEGORIES GRID --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const isActive = activeTab === cat._id;
              const categoryImage = cat.image || "/avy_logo.png";

              return (
                <div
                  key={cat._id}
                  onMouseEnter={() => setActiveTab(cat._id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer group
                    ${
                      isActive
                        ? "bg-[#5c2430] border-[#5c2430] text-[#fffaf8] shadow-lg shadow-[#5c2430]/15 -translate-y-[2px]"
                        : "bg-[#fdf2ee]/60 border-[#efdcd2] text-[#5c2430] hover:border-[#e9c9b8] hover:bg-[#fdf2ee]"
                    }
                  `}
                >
                  {/* Left Side: Thumbnail and Text Details */}
                  <div className="flex items-center gap-4">
                    {/* Circular Cloudinary Image Thumbnail */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-white border border-[#e9c9b8]/40">
                      <Image
                        src={categoryImage}
                        alt={cat.name}
                        fill
                        sizes="56px"
                        className="group-hover:scale-110 transition-transform duration-300 object-cover"
                        unoptimized={categoryImage.startsWith("http")}
                      />
                    </div>

                    {/* Category Name */}
                    <div>
                      <h3 className="font-serif font-bold text-base sm:text-lg tracking-wide line-clamp-1">
                        {cat.name}
                      </h3>
                      {cat.totalItems > 0 && (
                        <p
                          className={`text-xs font-medium ${isActive ? "text-[#e9c9b8]" : "text-[#7a5c56]"}`}
                        >
                          {cat.totalItems} Items
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Navigation Trigger Arrow Button */}
                  <Link
                    href={`/shop?category=${cat.name}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0
                      ${
                        isActive
                          ? "bg-[#fffaf8] text-[#5c2430]"
                          : "bg-white text-[#5c2430] border border-[#efdcd2] group-hover:bg-[#5c2430] group-hover:text-[#fffaf8]"
                      }
                    `}
                  >
                    <ChevronRight
                      size={18}
                      className="transform group-hover:translate-x-[1px] transition-transform"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
