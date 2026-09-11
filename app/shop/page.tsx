"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Eye,
  SlidersHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
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
  productType?: string; // "kurti" | "saree" etc.
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

const SIZES_FILTER = ["M", "L", "XL"];

// =========================================================================
// INTERACTIVE ZOOM & MANUAL SLIDER COMPONENT
// =========================================================================
function InteractiveImageSlider({
  images,
  title,
  isOutOfStock,
}: {
  images: string[];
  title: string;
  isOutOfStock: boolean;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-50">
        <Image
          src="/image_474d81.png"
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="p-4 object-contain opacity-30"
        />
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOutOfStock || !imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomPos(null);
  };

  const activeImage = images[currentIdx];

  return (
    <div
      ref={imgContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full group/slider flex items-center justify-center overflow-hidden cursor-crosshair"
    >
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transformOrigin: zoomPos ? `${zoomPos.x}% ${zoomPos.y}%` : "center",
          transform: zoomPos ? "scale(1.8)" : "scale(1)",
        }}
      >
        <Image
          src={activeImage}
          alt={`${title} - view ${currentIdx + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={currentIdx === 0}
          className={`p-2 sm:p-4 object-contain transition-opacity ${
            isOutOfStock ? "opacity-30" : "opacity-100"
          }`}
          unoptimized={activeImage.startsWith("http")}
        />
      </div>

      {images.length > 1 && !isOutOfStock && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-1.5 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-black hover:text-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-90 sm:opacity-0 group-hover/slider:opacity-100"
            title="Previous Image"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-1.5 z-20 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 hover:bg-black hover:text-white text-gray-800 rounded-full flex items-center justify-center shadow-md transition-all duration-200 opacity-90 sm:opacity-0 group-hover/slider:opacity-100"
            title="Next Image"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIdx ? "w-3 sm:w-4 bg-black" : "w-1 sm:w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =========================================================================
// MAIN SHOP CATALOG CONTENT WITH DUAL SECTION TABS
// =========================================================================
function ShopContent() {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type");

  // Active Catalog Tab: "kurti" | "saree"
  const [activeTab, setActiveTab] = useState<"kurti" | "saree">(
    typeFromUrl === "saree" ? "saree" : "kurti"
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [sortOption, setSortOption] = useState("default");
  const [filterPremium, setFilterPremium] = useState(false);
  const [filterSale, setFilterSale] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Toast System States
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [toastType, setToastType] = useState<"cart" | "wishlist">("cart");

  useEffect(() => {
    const typeQuery = searchParams.get("type");
    if (typeQuery === "saree") {
      setActiveTab("saree");
    } else if (typeQuery === "kurti") {
      setActiveTab("kurti");
    }
  }, [searchParams]);

  const triggerToast = (msg: string, type: "cart" | "wishlist" = "cart") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // API Fetch Function
  const fetchFilteredProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`);

      if (searchKeyword.trim() !== "") {
        url.searchParams.append("keyword", searchKeyword);
      }
      
      // Filter size only when applicable
      if (selectedSize !== "" && activeTab === "kurti") {
        url.searchParams.append("size", selectedSize);
      }
      
      if (filterPremium) {
        url.searchParams.append("isPremium", "true");
      }
      if (filterSale) {
        url.searchParams.append("isOnSale", "true");
      }

      url.searchParams.append("minPrice", minPrice.toString());
      url.searchParams.append("maxPrice", maxPrice.toString());

      if (sortOption === "priceLowToHigh") {
        url.searchParams.append("sort", "priceLowToHigh");
      } else if (sortOption === "priceHighToLow") {
        url.searchParams.append("sort", "priceHighToLow");
      }

      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.success && data.products) {
        // Client-side categorization filter matching productType or category
        const filteredByTab = data.products.filter((p: Product) => {
          const pType = (p.productType || p.category || "").toLowerCase();
          if (activeTab === "saree") {
            return pType.includes("saree") || pType.includes("sari");
          }
          return pType.includes("kurti") || pType.includes("kurtiya");
        });

        setProducts(filteredByTab);
      } else {
        setError("Catalog data retrieve karne me dikkat aayi.");
      }
    } catch (err) {
      console.error("Backend Server Error: ", err);
      setError("Backend Server data connectivity error or server dropped.");
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    searchKeyword,
    selectedSize,
    filterPremium,
    filterSale,
    minPrice,
    maxPrice,
    sortOption,
  ]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchFilteredProducts]);

  // Cart operations
  const handleAddToCart = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerToast("Please login first to modify cart logs!", "cart");
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
        }
      );
      const data = await response.json();
      if (data.success) {
        triggerToast(`${productTitle} successfully added to shopping bag!`, "cart");
      }
    } catch (err) {
      triggerToast("Network bridge drop.", "cart");
    }
  };

  // Wishlist operations
  const handleAddToWishlist = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      triggerToast("Please login first to save favorites!", "wishlist");
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
        }
      );
      const data = await response.json();
      if (data.success) {
        triggerToast(`${productTitle} saved to your favorites catalog!`, "wishlist");
      }
    } catch (err) {
      triggerToast("Network bridge drop.", "wishlist");
    }
  };

  // Reusable Filter Content Element
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
          Search {activeTab === "kurti" ? "Kurtis" : "Sarees"}
        </h3>
        <div className="relative rounded-xl shadow-sm">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder={`Search in ${activeTab === "kurti" ? "Kurtis" : "Sarees"}...`}
            className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </div>
        </div>
      </div>

      {/* Collection Types */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
          Collection Type
        </h3>
        <div className="flex flex-col space-y-2.5">
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterPremium}
              onChange={(e) => setFilterPremium(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
            />
            ⭐ Premium Collections
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterSale}
              onChange={(e) => setFilterSale(e.target.checked)}
              className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
            />
            🔥 On Sale Products
          </label>
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
          Filter By Price
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>Min Price</span>
              <span className="text-black">₹{minPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>Max Price</span>
              <span className="text-black">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Size Filter (Only for Kurtis) */}
      {activeTab === "kurti" && (
        <div className="space-y-3">
          <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-1.5">
            Select Size
          </h3>
          <div className="flex flex-wrap gap-2">
            {SIZES_FILTER.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                className={`w-9 h-9 border text-xs font-bold rounded-lg transition-all ${
                  selectedSize === size
                    ? "bg-black text-white border-black"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white text-gray-900 min-h-screen relative" suppressHydrationWarning>
      {/* Page Header */}
      <div className="bg-[#fdfbf7] py-8 sm:py-12 px-4 border-b border-gray-100 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold font-serif tracking-tight text-gray-900">
          Our Exclusive Collection
        </h1>
        <p className="text-gray-500 text-[10px] sm:text-xs mt-1 sm:mt-2 uppercase tracking-widest">
          <Link href="/" className="hover:text-black">Home</Link> / <span className="text-amber-600">Catalog</span>
        </p>

        {/* Dynamic Category Tabs Switcher */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => {
              setActiveTab("kurti");
              setSelectedSize("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === "kurti"
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Sparkles size={14} className={activeTab === "kurti" ? "text-amber-400" : "text-gray-400"} />
            Kurtis Collection
          </button>

          <button
            onClick={() => {
              setActiveTab("saree");
              setSelectedSize("");
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeTab === "saree"
                ? "bg-black text-white shadow-lg scale-105"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Layers size={14} className={activeTab === "saree" ? "text-amber-400" : "text-gray-400"} />
            Sarees Collection
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0 sticky top-28 h-fit">
            <FilterContent />
          </aside>

          {/* Mobile Drawer Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-black/50 backdrop-blur-sm">
              <div className="bg-white w-full max-h-[85vh] overflow-y-auto rounded-b-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between border-b pb-3">
                  <h2 className="font-bold text-base uppercase tracking-wider text-gray-900">
                    Filter {activeTab === "kurti" ? "Kurtis" : "Sarees"}
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-full bg-gray-100 text-gray-600 hover:text-black"
                  >
                    <X size={20} />
                  </button>
                </div>
                <FilterContent />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-black text-white font-bold rounded-xl text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid Section */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {/* Toolbar Header */}
            <div className="flex items-center justify-between border border-gray-100 bg-gray-50/50 rounded-2xl p-3 sm:p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-medium text-gray-600">
                {loading ? (
                  "Fetching catalog items..."
                ) : (
                  <>
                    Found <span className="font-bold text-gray-900">{products.length}</span>{" "}
                    {activeTab === "kurti" ? "Kurti" : "Saree"} designs
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 sm:py-2 border border-gray-200 rounded-xl bg-white text-xs font-bold text-gray-700 shadow-sm"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-xs font-bold bg-white border border-gray-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-gray-700 cursor-pointer focus:outline-none"
                >
                  <option value="default">Sort By: Default</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 text-sm font-semibold rounded-2xl">
                {error}
              </div>
            )}

            {/* Grid Loader / Empty / Products */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-2xl sm:rounded-3xl h-[280px] sm:h-[380px] animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-sm">
                  No {activeTab === "kurti" ? "Kurtis" : "Sarees"} match your current selection filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {products.map((product) => {
                  const isOutOfStock = product.stock <= 0;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                    >
                      {/* Price & Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm sm:text-base font-bold text-gray-900">
                            ₹{product.discountPrice ? product.discountPrice : product.price}
                          </span>
                          {product.discountPrice && product.discountPrice < product.price && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {isOutOfStock ? (
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-black text-white">
                              Out of Stock
                            </span>
                          ) : (
                            <>
                              {product.isOnSale && (
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-red-500 text-white">
                                  Sale
                                </span>
                              )}
                              {product.isPremium && (
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500 text-black">
                                  ⭐ Premium
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Interactive Zoom Canvas */}
                      <div className="relative w-full h-[180px] sm:h-[260px] rounded-xl sm:rounded-2xl bg-[#fafafa] overflow-hidden flex items-center justify-center mb-3">
                        <InteractiveImageSlider
                          images={product.images}
                          title={product.title}
                          isOutOfStock={isOutOfStock}
                        />

                        {!isOutOfStock && (
                          <div className="absolute top-2 right-2 z-30 flex flex-col gap-1.5 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product._id, product.title);
                              }}
                              className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 sm:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-[#e5c158] transition-all"
                              title="Add to Cart"
                            >
                              <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToWishlist(product._id, product.title);
                              }}
                              className="w-7 h-7 sm:w-9 sm:h-9 bg-white/90 sm:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-[#e5c158] transition-all"
                              title="Add to Wishlist"
                            >
                              <Heart size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="space-y-1 mt-auto">
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold tracking-wider uppercase">
                          <span className="text-red-500 truncate max-w-[60%]">
                            {product.category}
                          </span>
                          <span className="text-gray-400 truncate max-w-[35%]">
                            {product.brand}
                          </span>
                        </div>

                        <Link href={`/product/${product._id}`} className="block">
                          <h3 className="text-gray-800 font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-black transition-colors">
                            {product.title}
                          </h3>
                        </Link>

                        <Link
                          href={`/product/${product._id}`}
                          className="flex items-start gap-1 text-[11px] sm:text-xs text-gray-400 leading-tight group/desc hover:text-black transition-colors"
                        >
                          <p className="line-clamp-2 flex-1">{product.description}</p>
                          <Eye
                            size={12}
                            className="text-gray-400 group-hover/desc:text-black flex-shrink-0 mt-0.5 transition-colors hidden sm:block"
                          />
                        </Link>

                        {/* Sizes Pill Display (Kurtis specific) */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex gap-1 pt-1 flex-wrap">
                            {product.sizes.map((s) => (
                              <span
                                key={s._id}
                                className="text-[8px] sm:text-[9px] font-bold bg-gray-100 text-gray-600 px-1 sm:px-1.5 py-0.5 rounded"
                              >
                                {s.size} ({s.stock})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <div
        className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 transform transition-all duration-500 flex items-center gap-3 bg-[#0b0b0b] text-white border border-[#2a2415] pl-4 pr-5 py-3 sm:py-4 rounded-2xl shadow-2xl max-w-xs sm:max-w-sm ${
          showToast
            ? "translate-x-0 opacity-100 shadow-amber-500/10"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            toastType === "cart" ? "bg-[#e5c158]/20 text-[#e5c158]" : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {toastType === "cart" ? <ShoppingBag size={14} /> : <Heart size={14} />}
        </div>
        <div className="flex-1 pr-2">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Concierge Operations
          </p>
          <p className="text-xs font-medium text-white/95 line-clamp-2 leading-tight">
            {toastMsg}
          </p>
        </div>
        <button
          onClick={() => setShowToast(false)}
          className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  );
}