"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  Star,
  X,
  RotateCcw,
  Tag,
  Lock,
  Minus,
  Plus,
  Eye,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface Size {
  size: string;
  stock: number;
  _id: string;
}

interface Admin {
  _id: string;
  fullName: string;
  email: string;
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
  sizes: Size[];
  images: string[];
  ratings?: number;
  numOfReviews?: number;
  views?: number;
  isFeatured?: boolean;
  isPremium?: boolean;
  isOnSale?: boolean;
  isTrending?: boolean;
  isActive?: boolean;
  admin?: Admin;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeImage, setActiveImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "shipping">("desc");

  // Toast System States
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastType, setToastType] = useState<"cart" | "wishlist">("cart");

  const triggerToast = (msg: string, type: "cart" | "wishlist" = "cart") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`);
        const data = await response.json();

        if (data.success && data.products) {
          const targetProduct = data.products.find((p: Product) => p._id === productId);

          if (targetProduct) {
            setProduct(targetProduct);
            if (targetProduct.images && targetProduct.images.length > 0) {
              setActiveImage(targetProduct.images[0]);
            }
            if (targetProduct.sizes && targetProduct.sizes.length > 0) {
              const availableSize = targetProduct.sizes.find((s: Size) => s.stock > 0);
              if (availableSize) setSelectedSize(availableSize.size);
            }
          } else {
            setError("Product catalog mein nahi mila.");
          }
        } else {
          setError("Product synchronization error.");
        }
      } catch (err) {
        console.error(err);
        setError("Backend server connectivity issue.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Fetching Product Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fafafa] px-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center max-w-sm">
          <p className="font-bold text-sm">{error || "Product unavailable"}</p>
        </div>
        <Link
          href="/shop"
          className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-md"
        >
          Back To Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const displayRating = product.ratings ?? 0;
  const displayReviews = product.numOfReviews ?? 0;
  const displayViews = product.views ?? 0;

  const handleCartAction = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerToast("Please login first to add items to cart!", "cart");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addToCart`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity, size: selectedSize }),
      });
      const data = await response.json();
      if (data.success) {
        triggerToast(`${product.title} added to shopping bag!`, "cart");
      }
    } catch (err) {
      triggerToast("Network bridge drop.", "cart");
    }
  };

  const handleWishlistAction = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerToast("Please login first to save favorites!", "wishlist");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/addToWishlist`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (data.success) {
        triggerToast(`${product.title} added to your wishlist!`, "wishlist");
      }
    } catch (err) {
      triggerToast("Network bridge drop.", "wishlist");
    }
  };

  return (
    <div className="bg-[#fcfcfc] text-gray-900 min-h-screen antialiased selection:bg-amber-200">
      
      {/* 🔹 Breadcrumb Navigation */}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Shop Catalog
          </Link>
          <span>/</span>
          <span className="text-gray-400 capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* 🔹 Main Product Showcase Grid */}
      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: GALLERY & IMAGES (Fixed only on large screens via lg:sticky) */}
          <div className="lg:col-span-6 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="relative w-full h-[420px] sm:h-[520px] bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden group flex items-center justify-center p-4">
              
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {product.isPremium && (
                  <span className="bg-black/90 backdrop-blur-md text-[#e5c158] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Sparkles size={11} /> Premium
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <Image
                src={activeImage || (product.images && product.images[0]) || "/image_474d81.png"}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                unoptimized={activeImage.startsWith("http")}
              />
            </div>

            {/* Thumbnail Carousel */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 rounded-2xl bg-white border-2 overflow-hidden flex-shrink-0 transition-all p-1 ${
                      activeImage === img
                        ? "border-black shadow-md ring-2 ring-black/10 scale-95"
                        : "border-gray-200/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${i}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                      unoptimized={img.startsWith("http")}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/50">
                  {product.brand || "Style Hub"}
                </span>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Eye size={14} className="text-emerald-500 animate-pulse" />
                  <span>{displayViews} Views</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center bg-amber-400/10 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-300/30 text-xs font-bold gap-1">
                  <Star size={13} className="fill-amber-500 text-amber-500" />
                  <span>{displayRating}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  ({displayReviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                ₹{hasDiscount ? product.discountPrice : product.price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    ₹{product.price}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              )}
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <span>Select Size</span>
                  <button type="button" className="text-amber-700 underline font-semibold hover:text-black">
                    Size Guide
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((s: Size) => {
                    const outOfStockSize = s.stock <= 0;
                    return (
                      <button
                        key={s._id}
                        type="button"
                        disabled={outOfStockSize}
                        onClick={() => setSelectedSize(s.size)}
                        className={`min-w-[54px] h-12 border text-xs font-bold rounded-2xl transition-all flex flex-col items-center justify-center px-3 select-none relative ${
                          outOfStockSize
                            ? "bg-gray-100 border-gray-200 text-gray-400 line-through cursor-not-allowed"
                            : selectedSize === s.size
                            ? "bg-black text-white border-black shadow-md ring-2 ring-black/10 scale-105"
                            : "bg-white border-gray-200 text-gray-800 hover:border-black"
                        }`}
                      >
                        <span className="text-sm">{s.size}</span>
                        {!outOfStockSize && (
                          <span className="text-[9px] opacity-70 font-normal">
                            {s.stock < 5 ? `Only ${s.stock} left` : "In Stock"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Quantity
              </span>
              <div className="inline-flex items-center border border-gray-300 rounded-2xl bg-white shadow-sm p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCartAction}
                disabled={isOutOfStock}
                className="flex-1 py-4 bg-black text-[#e5c158] font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-900 transition-all shadow-xl flex items-center justify-center gap-2.5 active:scale-98 disabled:bg-gray-300 disabled:text-gray-500"
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                type="button"
                onClick={handleWishlistAction}
                className="px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 hover:border-rose-500 hover:text-rose-500 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                <Heart size={18} className="text-rose-500 fill-rose-500" />
                Wishlist
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-xs hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <RotateCcw size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  7-day Returns
                </span>
              </div>

              <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-xs hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Tag size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  Lowest Price
                </span>
              </div>

              <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 shadow-xs hover:-translate-y-0.5 transition-transform">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <Lock size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900 leading-tight">
                  Secure Payment
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex border-b border-gray-200 gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("desc")}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === "desc" ? "text-black border-b-2 border-black" : "text-gray-400"
                  }`}
                >
                  Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === "specs" ? "text-black border-b-2 border-black" : "text-gray-400"
                  }`}
                >
                  Product Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("shipping")}
                  className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                    activeTab === "shipping" ? "text-black border-b-2 border-black" : "text-gray-400"
                  }`}
                >
                  Shipping Info
                </button>
              </div>

              <div className="py-4 text-xs text-gray-600 leading-relaxed">
                {activeTab === "desc" && (
                  <p className="text-gray-700 text-sm">{product.description}</p>
                )}

                {activeTab === "specs" && (
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span className="font-semibold">Brand:</span>
                      <span>{product.brand}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span className="font-semibold">Category:</span>
                      <span>{product.category}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span className="font-semibold">Material / Fabric:</span>
                      <span>100% Premium Pure Cotton</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-100 pb-1.5">
                      <span className="font-semibold">Seller:</span>
                      <span>{product.admin?.fullName || "Verified Merchant"}</span>
                    </li>
                  </ul>
                )}

                {activeTab === "shipping" && (
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      Free standard shipping across India on orders above ₹999.
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      Dispatched within 24-48 hours. Delivered in 3-5 working days.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Toast Notification Box */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 bg-[#0b0b0b] text-white border border-[#2a2415] pl-4 pr-5 py-4 rounded-2xl shadow-2xl max-w-sm ${
          showToast
            ? "translate-x-0 opacity-100 shadow-amber-500/10"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            toastType === "cart" ? "bg-[#e5c158]/20 text-[#e5c158]" : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {toastType === "cart" ? <ShoppingBag size={14} /> : <Heart size={14} />}
        </div>
        <div className="flex-1 pr-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Cart System
          </p>
          <p className="text-xs font-medium text-white/95 line-clamp-2 leading-tight">
            {toastMsg}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowToast(false)}
          className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

    </div>
  );
}