"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, Heart, ArrowLeft, X, ShoppingCart } from "lucide-react";

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

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Premium Toast System
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToastNotification = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  // =========================================================================
  // 1. FETCH WISHLIST DATA FROM BACKEND
  // =========================================================================
  const fetchWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please login to view your wishlist favorites.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getUserWishlist`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success && data.wishlist) {
        setWishlistProducts(data.wishlist.products || []);
      } else {
        setError("Wishlist items retrieve karne mein dikkat aayi.");
      }
    } catch (err) {
      console.error("Wishlist Loading Error: ", err);
      setError("Backend Server responsive nahi hai.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // =========================================================================
  // 2. REMOVE FROM WISHLIST OPERATION
  // =========================================================================
  const handleRemoveItem = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/Wishlist/remove`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
        showToastNotification(`${productTitle} removed from favorites.`);
      } else {
        showToastNotification(data.message || "Item remove nahi ho paya.", "error");
      }
    } catch (err) {
      console.error("Delete Wishlist Item Error: ", err);
      showToastNotification("Server pipeline response connection error.", "error");
    }
  };

  // =========================================================================
  // 3. QUICK ADD TO CART INTERACTION
  // =========================================================================
  const handleMoveToCart = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

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
        showToastNotification(`${productTitle} moved to shopping cart!`);
        handleRemoveItem(productId, productTitle);
      } else {
        showToastNotification(data.message || "Cart me insert nahi ho paya.", "error");
      }
    } catch (err) {
      console.error("Cart Operation Error: ", err);
      showToastNotification("Network error inside Cart operations.", "error");
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans antialiased">
      
      {/* Top Banner Navigation Row */}
      <div className="bg-[#fdfbf7] py-12 px-4 border-b border-gray-100 text-center relative">
        <span className="text-[#c5a854] text-xs font-bold tracking-[0.2em] uppercase block mb-1">
          Bespoke Selection
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-gray-900 flex items-center justify-center gap-2">
          <Heart className="text-red-500 fill-red-500" size={28} /> My Wishlist
        </h1>
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-wider">
          Saved Luxury Assets Catalog ({wishlistProducts.length})
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl max-w-xl mx-auto text-center">
            {error}
          </div>
        )}

        {/* LOADING SHIMMER MASK */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-3xl h-[400px] animate-pulse" />
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          
          /* EMPTY WISHLIST CONTROLLER LAYOUT */
          <div className="text-center py-24 max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 bg-[#fdfbf7] border border-[#e5c158]/30 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <Heart size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-gray-900">Your Wishlist is Empty</h3>
              <p className="text-gray-400 text-sm">Save your favorite luxury outfits here to track sizes and purchase easily.</p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-[#e5c158] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[#1a1a1a] transition-all shadow-md">
                <ArrowLeft size={14} /> Back To Store Shop
              </Link>
            </div>
          </div>

        ) : (

          /* DYNAMIC WISHLIST TILES INTERFACE GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const cardImage = product.images && product.images.length > 0 ? product.images[0] : "/image_474d81.png";
              const hasDiscount = product.discountPrice && product.discountPrice < product.price;

              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  
                  <div className="flex justify-between items-center mb-3 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900">
                        ₹{hasDiscount ? product.discountPrice : product.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(product._id, product.title)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                      title="Remove Item From Whitelist"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="relative w-full h-[260px] rounded-2xl bg-[#fafafa] overflow-hidden flex items-center justify-center mb-4">
                    <Image
                      src={cardImage}
                      alt={product.title}
                      layout="fill"
                      objectFit="contain"
                      className={`p-4 transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? "opacity-30" : ""}`}
                      unoptimized={cardImage.startsWith("http")}
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {isOutOfStock ? (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-black text-white">
                          Out Of Stock
                        </span>
                      ) : (
                        <>
                          {product.isPremium && (
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-black">
                              ⭐ Premium
                            </span>
                          )}
                          {product.isOnSale && (
                            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white">
                              Sale
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="space-y-0.5">
                      <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase">
                        <span className="text-red-500">{product.category}</span>
                        <span className="text-gray-400">{product.brand}</span>
                      </div>
                      <Link href={`/product/${product._id}`} className="block">
                        <h3 className="text-gray-800 font-bold text-sm line-clamp-1 group-hover:text-black transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex gap-1 flex-wrap pb-1">
                        {product.sizes.map((s) => (
                          <span key={s._id} className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            s.stock > 0 ? "bg-gray-100 text-gray-600" : "bg-gray-50 text-gray-300 line-through"
                          }`}>
                            {s.size}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleMoveToCart(product._id, product.title)}
                      disabled={isOutOfStock}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-black text-[#e5c158] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#1a1a1a] transition-all shadow disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      <ShoppingBag size={14} /> Move To Shopping Cart
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LUXURY FLOATING TOAST NOTIFICATION WINDOW UI */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 bg-[#0b0b0b] text-white border border-[#2a2415] pl-4 pr-5 py-4 rounded-2xl shadow-2xl max-w-sm
        ${toast.show ? "translate-x-0 opacity-100 shadow-amber-500/10" : "translate-x-full opacity-0 pointer-events-none"}
      `}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
          ${toast.type === "success" ? "bg-[#e5c158]/20 text-[#e5c158]" : "bg-rose-500/20 text-rose-400"}
        `}>
          {toast.type === "success" ? <ShoppingCart size={16} /> : <X size={16} />}
        </div>
        
        <div className="flex-1 pr-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            System Operations
          </p>
          <p className="text-xs font-medium text-white/95 line-clamp-2 leading-tight">
            {toast.message}
          </p>
        </div>

        <button 
          onClick={() => setToast((prev) => ({ ...prev, show: false }))}
          className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

    </div>
  );
}