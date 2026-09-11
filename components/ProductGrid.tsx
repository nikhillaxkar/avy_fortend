"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, ArrowUpRight, X, Sparkles } from "lucide-react";

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

// 🎨 AVY Fashion Group Palette
const AVY = {
  ink: "#5c2430",        // Deep Burgundy
  inkDark: "#3d1720",    // Dark Burgundy
  accent: "#b5715f",     // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8",      // Warm White
};

export default function ProductGrid() {
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Toast States
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"cart" | "wishlist">("cart");

  // =========================================================================
  // API FETCH & FILTER (NO CHANGE IN LOGIC)
  // =========================================================================
  useEffect(() => {
    const fetchAndFilterProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`);
        const data = await response.json();

        if (data.success && data.products) {
          const allProducts: Product[] = data.products;
          const premiumOnly = allProducts.filter((product) => product.isPremium === true);

          const seenCategories = new Set<string>();
          const uniqueCategoryPremiumProducts: Product[] = [];

          for (const product of premiumOnly) {
            if (!seenCategories.has(product.category)) {
              seenCategories.add(product.category);
              uniqueCategoryPremiumProducts.push(product);
            }
          }

          setPremiumProducts(uniqueCategoryPremiumProducts.slice(0, 4));
        } else {
          setError("Catalog items sync error.");
        }
      } catch (err) {
        console.error("Product Grid Live Synced Exception: ", err);
        setError("Backend server down h ya products data pipe un-synchronized h.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterProducts();
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
  // CART & WISHLIST HANDLERS (NO CHANGE IN LOGIC)
  // =========================================================================
  const handleAddToCart = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerNotification("Please login first to add items to cart!", "cart");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addToCart`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        triggerNotification(`${productTitle} successfully added to your cart!`, "cart");
      } else {
        triggerNotification(data.message || "Could not append item to cart.", "cart");
      }
    } catch (err) {
      console.error("Cart Request Error: ", err);
      triggerNotification("Network connection failure with cart pipeline.", "cart");
    }
  };

  const handleAddToWishlist = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerNotification("Please login first to save items to wishlist!", "wishlist");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addToWishlist`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        triggerNotification(`${productTitle} added to your wishlist favorites!`, "wishlist");
      } else {
        triggerNotification(data.message || "Could not append item to wishlist.", "wishlist");
      }
    } catch (err) {
      console.error("Wishlist Request Error: ", err);
      triggerNotification("Network connection failure with wishlist pipeline.", "wishlist");
    }
  };

  return (
    <section className="bg-[#fffaf8] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- EDITORIAL HEADER SECTION --- */}
        <div className="relative mb-12 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e9c9b8]/60">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} style={{ color: AVY.accent }} />
                <span 
                  className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase"
                  style={{ color: AVY.accent }}
                >
                  Curated Haute Couture
                </span>
              </div>
              <h2 
                className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight"
                style={{ color: AVY.ink }}
              >
                Trending Lookbook
              </h2>
            </div>

            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 self-start md:self-auto border shadow-sm group"
              style={{ 
                borderColor: AVY.ink, 
                color: AVY.ink,
                backgroundColor: "transparent" 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = AVY.ink;
                e.currentTarget.style.color = AVY.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = AVY.ink;
              }}
            >
              Explore Full Collection
              <ArrowUpRight size={16} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Live Errors Display */}
        {error && (
          <div className="p-4 mb-8 bg-[#fdf2ee] text-[#5c2430] border border-[#e9c9b8] text-xs font-semibold rounded-2xl">
            {error}
          </div>
        )}

        {/* --- TRENDING EDITORIAL PRODUCT GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-[#fdf2ee] rounded-[2.5rem] h-[480px] animate-pulse border border-[#efdcd2]" />
            ))}
          </div>
        ) : premiumProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#fdf2ee]/40 rounded-[2.5rem] border border-dashed border-[#e9c9b8]">
            <p className="text-[#7a5c56] text-sm font-medium">No trending items found right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {premiumProducts.map((product, index) => {
              const isOutOfStock = product.stock <= 0;
              const cardImage = product.images && product.images.length > 0 ? product.images[0] : "/avy_logo.png";
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;

              return (
                <div 
                  key={product._id} 
                  className="group relative flex flex-col justify-between rounded-[2rem] bg-[#fdf2ee]/50 border border-[#efdcd2] hover:border-[#e9c9b8] p-4 sm:p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-[#5c2430]/10 hover:-translate-y-1.5"
                >
                  
                  {/* Top Overlay Badge & Indexing */}
                  <div className="flex justify-between items-center mb-3 z-20">
                    <span 
                      className="text-[11px] font-serif font-bold italic px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#e9c9b8]/50 shadow-sm"
                      style={{ color: AVY.ink }}
                    >
                      0{index + 1} // EDITION
                    </span>

                    {isOutOfStock ? (
                      <span className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#3d1720] text-[#fffaf8]">
                        Sold Out
                      </span>
                    ) : (
                      <span 
                        className="text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#e9c9b8] text-[#5c2430]"
                      >
                        ✦ Signature
                      </span>
                    )}
                  </div>

                  {/* Product Image Frame */}
                  <div className="relative w-full h-[320px] sm:h-[350px] rounded-[1.5rem] bg-white overflow-hidden border border-[#efdcd2]/60 mb-5 flex items-center justify-center">
                    <Image
                      src={cardImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      quality={90}
                      className={`p-4 object-contain transition-transform duration-700 ease-out group-hover:scale-110 ${isOutOfStock ? "opacity-40" : ""}`}
                      unoptimized={cardImage.startsWith("http")}
                    />

                    {/* Glassmorphic Overlay Hover Trigger */}
                    {!isOutOfStock && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5c2430]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-4 z-20">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAddToCart(product._id, product.title)}
                            className="w-11 h-11 bg-white/95 text-[#5c2430] rounded-full flex items-center justify-center shadow-lg hover:bg-[#5c2430] hover:text-[#fffaf8] transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag size={18} />
                          </button>
                          <button 
                            onClick={() => handleAddToWishlist(product._id, product.title)}
                            className="w-11 h-11 bg-white/95 text-[#5c2430] rounded-full flex items-center justify-center shadow-lg hover:bg-[#5c2430] hover:text-[#fffaf8] transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75"
                            aria-label="Add to wishlist"
                          >
                            <Heart size={18} />
                          </button>
                        </div>

                        <Link 
                          href={`/product/${product._id}`}
                          className="w-11 h-11 bg-[#5c2430] text-[#fffaf8] rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:text-[#5c2430] transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-100"
                        >
                          <ArrowUpRight size={18} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Details */}
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between items-baseline gap-2">
                      <span 
                        className="text-[10px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: AVY.accent }}
                      >
                        {product.category}
                      </span>

                      {/* Sizes Display */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex gap-1">
                          {product.sizes.slice(0, 3).map((s) => (
                            <span 
                              key={s._id} 
                              className="text-[8px] font-bold text-[#7a5c56]"
                            >
                              {s.size}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link href={`/product/${product._id}`} className="block">
                      <h3 
                        className="font-serif font-bold text-lg line-clamp-1 transition-colors group-hover:text-[#b5715f]"
                        style={{ color: AVY.ink }}
                      >
                        {product.title}
                      </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-bold" style={{ color: AVY.ink }}>
                        ₹{hasDiscount ? product.discountPrice : product.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-[#b39b95] line-through">₹{product.price}</span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* --- TOAST NOTIFICATION WINDOW --- */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 text-[#fffaf8] border border-[#e9c9b8]/30 pl-4 pr-5 py-3.5 rounded-2xl shadow-2xl max-w-sm
          ${showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
        `}
        style={{ backgroundColor: AVY.inkDark }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(233, 201, 184, 0.2)", color: AVY.accentSoft }}
        >
          {toastType === "cart" ? <ShoppingBag size={16} /> : <Heart size={16} />}
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