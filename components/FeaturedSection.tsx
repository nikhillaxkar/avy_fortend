"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  ArrowUpRight,
  X,
  Sparkles,
  Eye,
} from "lucide-react";

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
  ratings: number;
  numOfReviews: number;
  isFeatured: boolean;
  isPremium: boolean;
  isOnSale: boolean;
  isTrending: boolean;
  isActive: boolean;
}

// 🎨 AVY Fashion Group Theme Palette
const AVY = {
  ink: "#5c2430", // Deep Burgundy
  inkDark: "#3d1720", // Dark Burgundy
  accent: "#b5715f", // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8", // Warm White
  cardBg: "#fcf8f6", // Light Cream Card Background
};

export default function FeaturedSection() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Toast Notification States
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"cart" | "wishlist">("cart");

  // =========================================================================
  // API FETCH & FILTER
  // =========================================================================
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`,
        );
        const data = await response.json();

        if (data.success && data.products) {
          const trendingOnly = data.products.filter(
            (product: Product) => product.isTrending === true,
          );
          setTrendingProducts(trendingOnly.slice(0, 4));
        } else {
          setError("Trending collection sync karne mein fail hua.");
        }
      } catch (err) {
        console.error("Featured Grid API Exception: ", err);
        setError("Backend server se data load nahi ho pa rha hai.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const triggerNotification = (message: string, type: "cart" | "wishlist") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // =========================================================================
  // CART & WISHLIST HANDLERS
  // =========================================================================
  const handleAddToCart = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerNotification("Please login first to add items to cart!", "cart");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/addToCart`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        },
      );

      const data = await response.json();

      if (data.success) {
        triggerNotification(
          `${productTitle} successfully added to your cart!`,
          "cart",
        );
      } else {
        triggerNotification(
          data.message || "Could not append item to cart.",
          "cart",
        );
      }
    } catch (err) {
      console.error("Cart Request Error: ", err);
      triggerNotification(
        "Network connection failure with cart pipeline.",
        "cart",
      );
    }
  };

  const handleAddToWishlist = async (
    productId: string,
    productTitle: string,
  ) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerNotification(
        "Please login first to save items to wishlist!",
        "wishlist",
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/addToWishlist`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        },
      );

      const data = await response.json();

      if (data.success) {
        triggerNotification(
          `${productTitle} added to your wishlist favorites!`,
          "wishlist",
        );
      } else {
        triggerNotification(
          data.message || "Could not append item to wishlist.",
          "wishlist",
        );
      }
    } catch (err) {
      console.error("Wishlist Request Error: ", err);
      triggerNotification(
        "Network connection failure with wishlist pipeline.",
        "wishlist",
      );
    }
  };

  return (
    <section className="bg-[#fffaf8] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* ========================================================================= */}
        {/* 1. LUXURY EDITORIAL HEADER (CENTER-ALIGNED) */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-[#e9c9b8]/40 pb-8 gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2">
              <Sparkles size={14} style={{ color: AVY.accent }} />
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase"
                style={{ color: AVY.accent }}
              >
                MOST COVETED STYLES
              </span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-serif font-bold tracking-tight"
              style={{ color: AVY.ink }}
            >
              Trending Outfits
            </h2>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase border transition-all duration-300 shadow-sm group"
            style={{
              backgroundColor: AVY.inkDark,
              color: AVY.accentSoft,
              borderColor: AVY.inkDark,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = AVY.white;
              e.currentTarget.style.color = AVY.inkDark;
              e.currentTarget.style.borderColor = AVY.accentSoft;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = AVY.inkDark;
              e.currentTarget.style.color = AVY.accentSoft;
              e.currentTarget.style.borderColor = AVY.inkDark;
            }}
          >
            Explore Full Edit
            <ArrowUpRight
              size={15}
              className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Live Errors Alert */}
        {error && (
          <div className="p-4 bg-[#fdf2ee] text-[#5c2430] border border-[#e9c9b8] text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. HIGH-FASHION PRODUCT CARDS GRID */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-[#fdf2ee]/50 border border-[#efdcd2] rounded-[2rem] h-[440px] animate-pulse"
              />
            ))}
          </div>
        ) : trendingProducts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#e9c9b8] rounded-[2rem]">
            <p className="text-[#7a5c56] text-sm font-medium">
              Abhi koi bhi product trending list mein nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const displayImage =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/avy_logo.png";
              const hasDiscount =
                product.discountPrice && product.discountPrice < product.price;

              return (
                <div
                  key={product._id}
                  className="group relative rounded-[2rem] p-3 transition-all duration-500 border border-[#efdcd2]/80 hover:border-[#e9c9b8] hover:shadow-2xl flex flex-col justify-between"
                  style={{ backgroundColor: AVY.cardBg }}
                >
                  {/* IMAGE & BADGES CONTAINER */}
                  <div className="relative w-full h-[340px] sm:h-[360px] rounded-[1.6rem] bg-[#fffaf8] overflow-hidden flex items-center justify-center border border-[#efdcd2]/30">
                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20 pointer-events-none">
                      {isOutOfStock ? (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#3d1720] text-[#fffaf8] shadow-sm">
                          Sold Out
                        </span>
                      ) : hasDiscount ? (
                        <span
                          className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm backdrop-blur-md"
                          style={{
                            backgroundColor: "rgba(255, 250, 248, 0.9)",
                            borderColor: AVY.accentSoft,
                            color: AVY.ink,
                          }}
                        >
                          Sale
                        </span>
                      ) : (
                        <div />
                      )}

                      {/* Top Wishlist Quick Button */}
                      {!isOutOfStock && (
                        <button
                          onClick={() =>
                            handleAddToWishlist(product._id, product.title)
                          }
                          className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#e9c9b8]/50 flex items-center justify-center text-[#5c2430] hover:bg-[#5c2430] hover:text-white hover:border-[#5c2430] transition-all shadow-sm active:scale-90"
                          aria-label="Add to wishlist"
                        >
                          <Heart size={15} />
                        </button>
                      )}
                    </div>

                    {/* Image Layer */}
                    <Image
                      src={displayImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={90}
                      className={`p-3 object-contain transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? "opacity-30" : ""}`}
                      unoptimized={displayImage.startsWith("http")}
                    />

                    {/* SLIDE-UP QUICK ACTION BAR (Desktop) */}
                    {!isOutOfStock && (
                      <div className="hidden sm:flex absolute bottom-3 left-3 right-3 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 gap-2 z-20">
                        <button
                          onClick={() =>
                            handleAddToCart(product._id, product.title)
                          }
                          className="flex-1 py-3 px-4 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg transition-colors border"
                          style={{
                            backgroundColor: AVY.inkDark,
                            color: AVY.accentSoft,
                            borderColor: AVY.inkDark,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = AVY.white;
                            e.currentTarget.style.color = AVY.inkDark;
                            e.currentTarget.style.borderColor = AVY.accentSoft;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = AVY.inkDark;
                            e.currentTarget.style.color = AVY.accentSoft;
                            e.currentTarget.style.borderColor = AVY.inkDark;
                          }}
                        >
                          <ShoppingBag size={14} /> Add To Bag
                        </button>

                        <Link
                          href={`/product/${product._id}`}
                          className="w-11 h-11 rounded-xl bg-white text-[#5c2430] border border-[#e9c9b8] flex items-center justify-center shadow-lg hover:bg-[#fdf2ee] transition-colors"
                          aria-label="View product details"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    )}

                    {/* Mobile Quick Add Button */}
                    {!isOutOfStock && (
                      <button
                        onClick={() =>
                          handleAddToCart(product._id, product.title)
                        }
                        className="sm:hidden absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#5c2430] text-[#fffaf8] flex items-center justify-center shadow-md active:scale-90"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    )}
                  </div>

                  {/* PRODUCT DETAILS FOOTER */}
                  <div className="pt-4 px-2 pb-1 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span style={{ color: AVY.accent }}>
                        {product.category}
                      </span>
                      <span className="text-[#987a73] font-normal">
                        {product.brand}
                      </span>
                    </div>

                    <Link href={`/product/${product._id}`} className="block">
                      <h3
                        className="font-serif font-bold text-base line-clamp-1 transition-colors hover:underline"
                        style={{ color: AVY.ink }}
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {/* Price Block */}
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span
                        className="text-base font-bold"
                        style={{ color: AVY.ink }}
                      >
                        ₹{hasDiscount ? product.discountPrice : product.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#b39b95] line-through">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TOAST NOTIFICATION WINDOW */}
      {/* ========================================================================= */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 text-[#fffaf8] border border-[#e9c9b8]/30 pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl max-w-sm
          ${showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
        `}
        style={{ backgroundColor: AVY.inkDark }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: "rgba(233, 201, 184, 0.2)",
            color: AVY.accentSoft,
          }}
        >
          {toastType === "cart" ? (
            <ShoppingBag size={16} />
          ) : (
            <Heart size={16} />
          )}
        </div>

        <div className="flex-1 pr-2">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
            style={{ color: AVY.accentSoft }}
          >
            {toastType === "cart" ? "Shopping Cart" : "Wishlist Saved"}
          </p>
          <p className="text-xs font-medium text-[#fffaf8]/95 line-clamp-2 leading-tight">
            {toastMessage}
          </p>
        </div>

        <button
          onClick={() => setShowToast(false)}
          className="text-[#e9c9b8]/60 hover:text-[#fffaf8] transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </section>
  );
}
