"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Truck, Package, MapPin, Calendar, CreditCard, ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, Eye } from "lucide-react";

interface ProductDetails {
  _id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  images: string[];
}

interface OrderItem {
  product: ProductDetails;
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

interface OrderData {
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

export default function TrackOrderPage() {
  const params = useParams();
  const orderIdFromUrl = params.id as string; // URL parameter se ID readout kiya

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // =========================================================================
  // LIVE SHIPMENT GATEWAY DATA SNAPSHOT FETCH
  // =========================================================================
  useEffect(() => {
    const fetchTrackingData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authorization token check failed. Please login first.");
        setLoading(false);
        return;
      }

      try {
        // Postman verified tracking endpoint path integration
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/track/${orderIdFromUrl}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.message || "Is reference ID par tracking metrics available nahi hain.");
        }
      } catch (err) {
        console.error(err);
        setError("Backend server down h ya tracking network sync fail ho rha h.");
      } finally {
        setLoading(false);
      }
    };

    if (orderIdFromUrl) {
      fetchTrackingData();
    }
  }, [orderIdFromUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400 bg-white">
        Syncing Logistics Matrix Nodes...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-center p-4">
        <div className="p-4 bg-red-50 text-red-600 border border-red-100 text-sm font-semibold rounded-2xl max-w-md">
          {error || "Order data offline."}
        </div>
        <Link href="/orders" className="text-xs font-bold uppercase tracking-widest underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
      </div>
    );
  }

  // =========================================================================
  // STEPPER STATUS INDEX EVALUATOR LOGIC
  // =========================================================================
  const getStatusStepIndex = (status: string) => {
    const upperStatus = status?.toUpperCase();
    if (upperStatus === "DELIVERED") return 3;
    if (upperStatus === "SHIPPED") return 1;
    return 0; // Default: PLACED / Processing status
  };

  const currentStepIndex = getStatusStepIndex(order.orderStatus);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
  });

  const trackingSteps = [
    { title: "Order Placed", desc: "Fulfillment matrix parsed logs" },
    { title: "Shipped", desc: "In transit courier handoff node" },
    { title: "Out For Delivery", desc: "Local city hub dispatch van" },
    { title: "Delivered", desc: "Secure drop-point destination reached" }
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans antialiased pb-16">
      
      {/* Top Breadcrumb Header Banner */}
      <div className="bg-[#fdfbf7] py-12 px-4 border-b border-gray-100 text-center relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between absolute inset-x-4 top-4 text-xs">
          <Link href="/orders" className="inline-flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider hover:text-black">
            <ArrowLeft size={14} /> Tracking Records
          </Link>
        </div>
        <span className="text-[#c5a854] text-xs font-bold tracking-[0.25em] uppercase block mb-1">
          LIVE COURIER RADAR STREAM
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900 uppercase tracking-tight">
          Track Shipment: {order.orderId}
        </h1>
        <p className="text-gray-400 text-[11px] mt-1">Order Date: {formattedDate}</p>
      </div>

      {/* Main Structural Framework Layout Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* ========================================================================= */}
        {/* STEP 1: HORIZONTAL LIVE RETRIEVAL STEPPER MILESTONES                      */}
        {/* ========================================================================= */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Logistics Status</p>
                <p className="text-sm font-black uppercase tracking-wide text-gray-900">
                  {order.orderStatus === "PLACED" ? "Processing Pending" : order.orderStatus}
                </p>
              </div>
            </div>
            
            <div className="text-right text-xs">
              <p className="text-gray-400 font-medium">Payment Mode</p>
              <p className="font-bold text-gray-800 uppercase">{order.paymentMethod} ({order.paymentStatus})</p>
            </div>
          </div>

          {/* Stepper Graphic Horizontal Line Nodes Mapping */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {trackingSteps.map((step, idx) => {
              const isDone = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3 relative group">
                  
                  {/* Vertical line indicator on mobile, horizontal indicator line on desktop */}
                  {idx !== 3 && (
                    <div className={`hidden md:block absolute top-[18px] left-[50%] right-[-50%] h-[3px] -z-10 transition-colors duration-500 ${
                      idx < currentStepIndex ? "bg-green-500" : "bg-gray-100"
                    }`} />
                  )}

                  {/* Stepper Circle Bullet Nodes */}
                  <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                    isDone 
                      ? "bg-green-500 border-green-500 text-white fill-current" 
                      : "bg-white border-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-green-100 scale-105" : ""}`}>
                    {isDone ? <CheckCircle2 size={16} className="text-white fill-green-500" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>

                  {/* Text descriptions blocks */}
                  <div className="space-y-0.5 text-left md:text-center">
                    <p className={`text-xs font-bold transition-colors ${isDone ? "text-gray-900" : "text-gray-400"}`}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium leading-tight max-w-[160px]">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 2: CONSIGNMENT DETAILS SPLIT MATRIX                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PRODUCTS MANIFEST ARRAY (Takes 7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2">
              Package Manifest Summary
            </h3>
            
            <div className="divide-y divide-gray-50">
              {order.orderItems?.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 text-xs">
                  
                  {/* Dynamic Product ID Link Redirection Wrapper */}
                  <Link 
                    href={`/product/${item.product?._id || item.product}`}
                    className="flex items-center gap-4 group/item flex-1 cursor-pointer"
                  >
                    <div className="relative w-14 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <Image 
                        src={item.image || "/image_474d81.png"} 
                        alt={item.title} 
                        layout="fill" 
                        objectFit="contain" 
                        className="p-0.5 transition-transform group-hover/item:scale-105" 
                        unoptimized={item.image?.startsWith("http")} 
                      />
                    </div>
                    <div className="space-y-0.5 max-w-[280px] sm:max-w-sm">
                      <p className="font-bold text-gray-800 group-hover/item:text-amber-600 transition-colors flex items-center gap-1 capitalize">
                        {item.title}
                        <Eye size={12} className="text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        ₹{item.price} × {item.quantity} units {item.size && `• Size: ${item.size}`}
                      </p>
                    </div>
                  </Link>

                  <span className="font-extrabold text-gray-900 text-right text-sm">
                    ₹{item.totalPrice || (item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: SHIPPING ADDRESS & BILLING CARD LOG (Takes 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address Box card */}
            {order.shippingAddress && (
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-amber-500" /> Delivery Hand-point
                </h3>
                <div className="text-xs space-y-2 leading-relaxed text-gray-600">
                  <p><span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block mb-0.5">Consignee Recipient</span> {order.shippingAddress.fullName}</p>
                  <p><span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block mb-0.5">Contact Line</span> {order.shippingAddress.phone}</p>
                  <p>
                    <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block mb-0.5">Physical Destination</span>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} – <span className="font-mono font-bold text-gray-900">{order.shippingAddress.pincode}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Financial totals sub-invoice summary card */}
            <div className="bg-[#fdfbf7] border border-gray-100 rounded-[2.5rem] p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-200/50 pb-2">
                Financial Summary Invoice
              </h3>
              <div className="space-y-2 text-xs font-medium text-gray-500">
                <div className="flex justify-between">
                  <span>Items manifest quantity</span>
                  <span className="font-bold text-gray-800">{order.totalItems || order.orderItems?.length} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Transport Duty</span>
                  <span className="text-green-600 font-bold uppercase text-[10px]">Free Delivery</span>
                </div>
                <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-baseline text-sm font-bold text-gray-900">
                  <span>Net Ledger Paid</span>
                  <span className="text-xl font-black text-black tracking-tight">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Trust Lock Row Panel info */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest justify-center">
          <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-amber-500" /> Insured Shipment Transit</div>
          <div className="flex items-center gap-1.5"><Package size={16} className="text-amber-500" /> Tamper-Proof Packaging Secure</div>
        </div>

      </div>

    </div>
  );
}