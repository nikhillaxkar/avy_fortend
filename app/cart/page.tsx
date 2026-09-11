"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShieldCheck, Truck, CreditCard, X, AlertCircle } from "lucide-react";

interface CartProductItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    images?: string[];
    category?: string;
    brand?: string;
  } | null; // Database references check logic bypass helper
  quantity: number;
  price: number;
  totalPrice: number;
}

interface CartState {
  _id: string;
  user: string;
  products: CartProductItem[];
}

export default function CartPage() {
  const [cartData, setCartData] = useState<CartState | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Toast System State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  // =========================================================================
  // 1. DYNAMIC GET CART API FETCH PIPELINE (As per image_593a72.png)
  // =========================================================================
  const fetchUserCartData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in to your profile to inspect active items cart container.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getUserCart`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success && data.cart) {
        setCartData(data.cart);
        setTotalItems(data.totalItems || 0);
        setCartTotal(data.cartTotal || 0);
      } else {
        setError("Shopping bag data process failed inside client compilers.");
      }
    } catch (err) {
      console.error("Cart Loading API Exception: ", err);
      setError("Backend server down h ya infrastructure routing offline h.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCartData();
  }, []);

  // =========================================================================
  // 2. QUANTITY ADJUSTMENTS LOGIC ENGINE (PUT Mapping as per image_59372a.png)
  // =========================================================================
  const handleUpdateQuantity = async (productId: string, currentQty: number, operation: "increase" | "decrease", productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    // Safety checks: decrease operational boundary condition check rules
    if (operation === "decrease" && currentQty <= 1) {
      handleRemoveFromCart(productId, productTitle);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/updateCartQuantity`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          action: operation, // Strict API keys parameter string match: "increase" | "decrease"
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Backend recalculations response sets logic
        fetchUserCartData();
        triggerToast(`Updated quantity specifications for item.`);
      } else {
        triggerToast(data.message || "Quantity mapping criteria error.", "error");
      }
    } catch (err) {
      console.error("Update Quantity Error Block: ", err);
      triggerToast("Server connection error during counter recalculation.", "error");
    }
  };

  // =========================================================================
  // 3. REMOVE PRODUCT SYSTEM CALL (DELETE Mapping as per image_593765.png)
  // =========================================================================
  const handleRemoveFromCart = async (productId: string, productTitle: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/removeFromCart`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }), // Input target object parameter key configurations
      });

      const data = await response.json();

      if (data.success) {
        fetchUserCartData();
        triggerToast(`${productTitle || "Product"} completely removed from active bags.`);
      } else {
        triggerToast(data.message || "Could not execute object erase parameters.", "error");
      }
    } catch (err) {
      console.error("Remove Item Controller Crash: ", err);
      triggerToast("Network link failed with pipeline data drops.", "error");
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-[#fdfbf7] py-12 px-4 border-b border-gray-100 text-center">
        <span className="text-[#c5a854] text-xs font-bold tracking-[0.2em] uppercase block mb-1">
          Secure Store checkout
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-tight text-gray-900 flex items-center justify-center gap-2">
          <ShoppingBag size={28} /> Shopping Cart
        </h1>
        <p className="text-gray-400 text-xs mt-2 uppercase tracking-wider">
          Review your dynamic bag catalog segments ({totalItems} items allocation)
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Connection/Authorization failures tracking */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl max-w-xl mx-auto text-center flex items-center justify-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-2 space-y-4 bg-gray-50 h-[400px] rounded-3xl border border-gray-100" />
            <div className="bg-gray-50 h-[300px] rounded-3xl border border-gray-100" />
          </div>
        ) : !cartData || cartData.products.length === 0 ? (
          
          /* EMPTY FALLBACK CONTAINER STATE */
          <div className="text-center py-20 max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 bg-[#fdfbf7] border border-[#e5c158]/30 rounded-full flex items-center justify-center mx-auto text-gray-300">
              <ShoppingBag size={36} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-gray-900">Your Shopping Cart is Empty</h3>
              <p className="text-gray-400 text-sm">Looks like you haven't added any luxury clothing assets to your bags yet.</p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-[#e5c158] text-xs font-bold tracking-widest uppercase rounded-xl hover:bg-[#1a1a1a] transition-all shadow-md">
                <ArrowLeft size={14} /> Back To Store Shop
              </Link>
            </div>
          </div>

        ) : (

          /* SPLIT CART ACCOUNT MANAGEMENT PANEL LAYOUTS */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT CONTAINER LAYER: ITEMS RUNTIME CARDS ITERATORS */}
            <div className="lg:col-span-2 space-y-4">
              {cartData.products.map((item) => {
                // Database fallback checks parameters definitions layer block rules mapping
                const hasValidProduct = item.product !== null;
                const productId = hasValidProduct ? item.product!._id : item._id;
                const itemTitle = hasValidProduct ? item.product!.title : "Style Hub Premium Item";
                const itemCategory = hasValidProduct ? item.product!.category : "Premium Apparel Wear";
                const itemBrand = hasValidProduct ? item.product!.brand : "Style Hub Collection";
                
                // Cloudinary strings backup rules setup loops layout mapping
                const imageSrc = hasValidProduct && item.product!.images && item.product!.images.length > 0
                  ? item.product!.images[0]
                  : "/image_474d81.png";

                return (
                  <div 
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow gap-4"
                  >
                    {/* Item Details Row left alignment block */}
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="relative w-20 h-24 bg-[#fafafa] border border-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={imageSrc}
                          alt={itemTitle}
                          layout="fill"
                          objectFit="contain"
                          className="p-1"
                          unoptimized={imageSrc.startsWith("http")}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase block">
                          {itemCategory} / {itemBrand}
                        </span>
                        <h3 className="text-gray-900 font-bold text-sm sm:text-base line-clamp-2 max-w-sm">
                          {itemTitle}
                        </h3>
                        <p className="text-xs font-bold text-amber-600 sm:hidden">
                          Unit Price: ₹{item.price}
                        </p>
                      </div>
                    </div>

                    {/* Operational controls grid blocks tracking right layout sets alignment */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                      
                      {/* Counter triggers row container buttons */}
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                        <button 
                          onClick={() => handleUpdateQuantity(productId, item.quantity, "decrease", itemTitle)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200/60 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-xs text-gray-900 select-none">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(productId, item.quantity, "increase", itemTitle)}
                          className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-200/60 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Display final computed line parameters blocks info summaries */}
                      <div className="text-right min-w-[90px] space-y-0.5">
                        <p className="text-sm font-extrabold text-gray-900">
                          ₹{item.totalPrice}
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 hidden sm:block">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      {/* Permanent object delete parameters drops triggers button links */}
                      <button
                        onClick={() => handleRemoveFromCart(productId, itemTitle)}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                        title="Remove Object Line"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT CONTAINER LAYER: CORPORATE ORDER PRICING SUMMARY MATRIX */}
            <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm space-y-6 sticky top-28">
              <h3 className="text-lg font-bold font-serif text-gray-900 border-b border-gray-50 pb-3">
                Order Financial Metrics
              </h3>
              
              {/* Computation lists breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Bag Quantity Subtotal</span>
                  <span className="font-bold text-gray-800">{totalItems} units</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Standard Shipping Log</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Free Delivery</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST Taxation Duty</span>
                  <span className="text-gray-400 font-medium">Included in base price</span>
                </div>
                
                <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-gray-900 text-base">Total Payable</span>
                  <span className="font-extrabold text-gray-900 text-2xl tracking-tight">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              {/* Action route button linkage checkout panel endpoints */}
              <div className="pt-2 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-black text-[#e5c158] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-all shadow-md group"
                >
                  Proceed to Secure Checkout <CreditCard size={14} />
                </Link>
                <Link 
                  href="/shop"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-3 border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all text-center"
                >
                  <ArrowLeft size={12} /> Continue Shopping
                </Link>
              </div>

              {/* Trust badges footer tags framework indicators elements info panels */}
              <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-amber-500" /> Fully Encrypted</div>
                <div className="flex items-center gap-1.5"><Truck size={16} className="text-amber-500" /> Insured Transit</div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PREMIUM SLIDE-IN TOAST PANEL NOTIFICATION MODULE MATRIX                    */}
      {/* ========================================================================= */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 bg-[#0b0b0b] text-white border border-[#2a2415] pl-4 pr-5 py-4 rounded-2xl shadow-2xl max-w-sm
        ${toast.show ? "translate-x-0 opacity-100 shadow-amber-500/10" : "translate-x-full opacity-0 pointer-events-none"}
      `}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
          ${toast.type === "success" ? "bg-[#e5c158]/20 text-[#e5c158]" : "bg-rose-500/20 text-rose-400"}
        `}>
          <ShoppingBag size={14} />
        </div>
        
        <div className="flex-1 pr-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Cart Operations
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