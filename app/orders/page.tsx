"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, Calendar, CreditCard, ArrowLeft, AlertCircle, ShoppingBag, Eye } from "lucide-react";

interface OrderItem {
  product: string;
  title: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
  _id: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  shippingAddress: ShippingAddress;
  _id: string;
  orderId: string;
  user: string;
  orderItems: OrderItem[];
  totalItems: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string; // e.g. "PLACED", "SHIPPED", "DELIVERED"
  createdAt: string;
  updatedAt: string;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // =========================================================================
  // LIVE ORDERS FETCH LIFECYCLE (As per image_2ce096.png)
  // =========================================================================
  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authorization missing. Please login to track your active orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/order/my-orders`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success && data.orders) {
          setOrders(data.orders);
        } else {
          setError(data.message || "Failed to load orders history from database pipeline.");
        }
      } catch (err) {
        console.error("Orders pipeline error: ", err);
        setError("Backend infrastructure offline ya token sync issue.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  // Filter functionality mapping
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    return order.orderStatus?.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans antialiased">
      
      {/* Upper Page Banner Context */}
      <div className="bg-[#fdfbf7] py-12 px-4 border-b border-gray-100 text-center">
        <span className="text-[#c5a854] text-xs font-bold tracking-[0.2em] uppercase block mb-1">
          STYLE HUB CONCIERGE DESK
        </span>
        <h1 className="text-3xl font-bold font-serif text-gray-900 flex items-center justify-center gap-2">
          <Package className="text-amber-500" size={26} /> Track My Orders
        </h1>
        <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-wider">
          Live Shipment & Fulfillment History Ledger ({orders.length} orders tracked)
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Connection/Sync Error Blocks */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-2xl max-w-xl mx-auto text-center flex items-center justify-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* STATUS BAR QUICK CONTROLLERS PANEL */}
        {!loading && orders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-100 text-xs font-bold uppercase tracking-wider select-none">
            {["All", "PLACED", "SHIPPED", "DELIVERED"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2.5 rounded-xl border transition-all flex-shrink-0 ${
                  activeFilter === filter 
                    ? "bg-black text-white border-black shadow" 
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {filter === "PLACED" ? "Fulfillment Pending" : filter}
              </button>
            ))}
          </div>
        )}

        {/* INTERACTIVE CARDS CORE ENGINE CONTAINER */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 h-44 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          
          /* EMPTY GRID FALLBACK INTERFACE */
          <div className="text-center py-20 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto border border-dashed border-gray-200">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">No Orders Documented</h3>
              <p className="text-xs text-gray-400 mt-0.5">Is collection criteria segment par abhi koi active tracing logs nahi hain.</p>
            </div>
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black text-[#e5c158] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-900 transition-colors">
                <ArrowLeft size={13} /> Back To Store Shop
              </Link>
            </div>
          </div>

        ) : (

          /* LIVE LOGS ITEM LISTS MATRIX BUILDER */
          <div className="space-y-8">
            {filteredOrders.map((order) => {
              
              // Formatting Dynamic Colors parameters base states matching response types
              const statusColors = {
                PLACED: "bg-amber-50 text-amber-700 border-amber-200",
                SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
                DELIVERED: "bg-green-50 text-green-700 border-green-200",
              }[order.orderStatus] || "bg-gray-50 text-gray-600 border-gray-200";

              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric"
              });

              return (
                <div 
                  key={order._id}
                  className="bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  
                  {/* Card Main Utility Metadata Ribbon Header */}
                  <div className="bg-gray-50/80 border-b border-gray-100 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <div className="space-y-0.5">
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px]">Order Reference ID</p>
                        <p className="font-mono font-bold text-gray-900 tracking-wide uppercase">{order.orderId}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px]">Placement Timestamp</p>
                        <p className="font-bold text-gray-800 flex items-center gap-1"><Calendar size={13} className="text-gray-400" /> {formattedDate}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-gray-400 font-medium uppercase tracking-wider text-[9px]">Settlement Channel</p>
                        <p className="font-bold text-gray-800 uppercase flex items-center gap-1"><CreditCard size={13} className="text-gray-400" /> {order.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Status Badge Mapping Output */}
                    <span className="px-3 py-1 border text-[10px] font-bold uppercase tracking-wider rounded-full shadow-inner dynamic-status-badge">
                      {order.orderStatus === "PLACED" ? "Processing Pending" : order.orderStatus}
                    </span>
                  </div>

                  {/* Card Central Segment: Inner Products Loop Render */}
                  <div className="p-4 sm:p-5 flex-1 divide-y divide-gray-50">
                    {order.orderItems?.map((item) => (
                      <div key={item._id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 text-xs">
                        
                        {/* LINK RE-DIRECT LAYER INTEGRATION FOR SPECIFIC ID TARGET */}
                        <Link 
                          href={`/product/${item.product}`} 
                          className="flex items-center gap-4 group/item flex-1 cursor-pointer"
                        >
                          {/* Cloudinary Active Image rendering layout element */}
                          <div className="relative w-14 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center group-hover/item:opacity-80 transition-opacity">
                            <Image 
                              src={item.image || "/image_474d81.png"} 
                              alt={item.title} 
                              layout="fill" 
                              objectFit="contain" 
                              className="p-0.5" 
                              unoptimized={item.image?.startsWith("http")} 
                            />
                          </div>
                          
                          <div className="space-y-0.5 max-w-[280px] sm:max-w-md">
                            <p className="font-bold text-gray-900 group-hover/item:text-amber-600 transition-colors capitalize flex items-center gap-1">
                              {item.title}
                              <Eye size={12} className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                              <span>Rate: ₹{item.price}</span>
                              <span>•</span>
                              <span>Units ordered: {item.quantity}</span>
                              {item.size && (
                                <>
                                  <span>•</span>
                                  <span className="font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[8px] uppercase">Size: {item.size}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                        
                        {/* Right Line total computed row indicators */}
                        <span className="font-extrabold text-gray-900 flex-shrink-0 text-sm">
                          ₹{item.totalPrice || (item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card Lower Segment Footer: Shipping Metadata & Grand Calculations Row */}
                  <div className="bg-gray-50/20 border-t border-gray-50 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-semibold">
                    
                    {/* Nested shipping address elements destructuring path checks (as per image_2ce096.png) */}
                    {order.shippingAddress && (
                      <div className="text-gray-400 flex items-start gap-2 leading-tight font-medium max-w-xl flex-1">
                        <Truck size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <p>
                          <span className="font-bold text-gray-700">Consignee:</span> {order.shippingAddress.fullName} ({order.shippingAddress.phone}) <br />
                          <span className="font-bold text-gray-700">Destination:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                        </p>
                      </div>
                    )}

                    {/* NEW BUTTON GATEWAY: DISPATCH LOGISTICS SHIFT WITH EXPLICIT ORDER TRACK REFERENCE */}
                    <div className="flex flex-row sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-wrap md:flex-nowrap">
                      
                      <Link 
                        href={`/track/${order.orderId}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-900 text-black font-bold text-[11px] uppercase tracking-wider rounded-xl bg-white hover:bg-black hover:text-[#e5c158] transition-all"
                      >
                        <Truck size={13} /> Track Order Shipment
                      </Link>

                      {/* Final Net Amount Payable summary metric box */}
                      <div className="text-right flex flex-col items-end justify-center min-w-[100px]">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Gross Invoice Paid</span>
                        <span className="text-lg font-black text-black tracking-tight">₹{order.totalAmount}</span>
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