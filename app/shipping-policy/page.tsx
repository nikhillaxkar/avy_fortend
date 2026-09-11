"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Truck, 
  Clock, 
  MapPin, 
  PackageCheck, 
  AlertCircle, 
  Mail, 
  Search,
  Sparkles 
} from 'lucide-react';

// 🎨 AVY Fashion Palette
const AVY = {
  ink: "#5c2430",        // Deep Burgundy
  inkDark: "#3d1720",    // Dark Burgundy
  accent: "#b5715f",     // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8",      // Warm White
  cardBg: "#fdf2ee",     // Soft Blush Card Background
};

export default function ShippingPolicy() {
  return (
    <div className="bg-[#fffaf8] text-[#5c2430] min-h-screen font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* SECTION 1: HEADER & BREADCRUMB */}
      {/* ========================================================================= */}
      <div className="bg-[#fdf2ee]/60 py-16 px-4 border-b border-[#e9c9b8]/60 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-3">
          <Sparkles size={13} style={{ color: AVY.accent }} />
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: AVY.ink }}>
            CRAFTED WITH PASSION & PURITY
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: AVY.ink }}>
          Shipping & Delivery Policy
        </h1>
        <p className="text-[#8c6b63] text-xs mt-3 uppercase tracking-widest font-semibold">
          <Link href="/" className="hover:text-[#5c2430] transition-colors">Home</Link> / <span style={{ color: AVY.accent }}>Shipping Policy</span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST BADGES STRIP */}
      {/* ========================================================================= */}
      <div className="bg-[#5c2430] text-[#fffaf8] py-6 px-4 shadow-md">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <Truck className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">FREE EXPRESS SHIPPING</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">On Orders Above ₹999</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <Clock className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">24-48 HR DISPATCH</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">Real-Time Processing</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <MapPin className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">PAN INDIA DELIVERY</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">25,000+ Pin Codes</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <PackageCheck className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">SAFE PACKAGING</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">Tamper-Proof Boxes</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: MAIN POLICY CONTENT */}
      {/* ========================================================================= */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-[#efdcd2] space-y-10">
          
          {/* Effective Date Note */}
          <div className="border-l-4 border-[#b5715f] pl-4 space-y-2 bg-[#fdf2ee]/40 py-3 pr-4 rounded-r-xl">
            <p className="text-xs md:text-sm text-[#8c6b63] font-semibold tracking-wider uppercase">
              Effective Date: September 2026
            </p>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              At <strong style={{ color: AVY.ink }}>AVY Fashion Group</strong>, we understand that you eagerly await your beautiful ethnic wear and traditional kurtis. We partner with India’s leading courier networks to ensure your orders reach you in pristine condition and as quickly as possible.
            </p>
          </div>

          {/* Section 1: Shipping Rates */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#b5715f]" /> 1. Shipping Charges & Rates
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              We offer straightforward and transparent shipping pricing across all locations in India:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl space-y-1">
                <h3 className="font-serif font-bold text-[#5c2430] text-sm">Orders Above ₹999</h3>
                <p className="text-xs text-[#6e5048] leading-relaxed">
                  <strong>FREE Express Shipping</strong> across all deliverable pin codes in India.
                </p>
              </div>
              <div className="p-5 bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl space-y-1">
                <h3 className="font-serif font-bold text-[#5c2430] text-sm">Orders Below ₹999</h3>
                <p className="text-xs text-[#6e5048] leading-relaxed">
                  A nominal flat shipping fee of <strong>₹70</strong> is applied at checkout.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Order Processing & Dispatch */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#b5715f]" /> 2. Real-Time Order Dispatch Timeline
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              We begin preparing your outfit for delivery immediately after order confirmation:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li><strong>Dispatch Time:</strong> Orders are verified, quality-checked, and dispatched within <strong>24 to 48 hours</strong> from our fulfillment center.</li>
              <li><strong>Sundays & Public Holidays:</strong> Orders placed on Sundays or official national holidays are dispatched on the next working business day.</li>
            </ul>
          </section>

          {/* Section 3: Delivery Timelines Table */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#b5715f]" /> 3. Estimated Delivery Timeframes
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              Transit times depend on your geographical location in India:
            </p>
            
            <div className="overflow-x-auto rounded-2xl border border-[#efdcd2]">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#fdf2ee] text-[#5c2430] border-b border-[#efdcd2]">
                    <th className="p-4 font-serif font-bold">Destination / Region</th>
                    <th className="p-4 font-serif font-bold">Estimated Delivery Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#efdcd2] text-[#6e5048]">
                  <tr>
                    <td className="p-4 font-medium text-[#5c2430]">Metro Cities (Delhi NCR, Mumbai, Bengaluru, etc.)</td>
                    <td className="p-4">3 to 5 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#5c2430]">Tier 2 & Tier 3 Cities</td>
                    <td className="p-4">4 to 6 Business Days</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-[#5c2430]">Rest of India & Remote Locations</td>
                    <td className="p-4">5 to 8 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: Real-Time Tracking */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Search className="w-5 h-5 text-[#b5715f]" /> 4. Real-Time Order Tracking
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              As soon as your shipment leaves our warehouse:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li>You will receive an automated SMS, WhatsApp message, and Email containing the <strong>Tracking ID</strong> and courier link.</li>
              <li>You can monitor the live movement of your order directly through the courier partner’s real-time tracking portal.</li>
            </ul>
          </section>

          {/* Section 5: Delivery Attempts & Packaging */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#b5715f]" /> 5. Packaging & Delivery Execution
            </h2>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li><strong>Secure Packaging:</strong> All ethnic kurtis and dress materials are shipped in weatherproof, tamper-proof packaging to ensure zero damage during transit.</li>
              <li><strong>Delivery Attempts:</strong> Courier partners will make up to <strong>3 delivery attempts</strong>. Please ensure your contact phone number is reachable for delivery calls.</li>
              <li><strong>Incorrect Address:</strong> AVY Fashion Group is not responsible for delayed or failed deliveries caused by incomplete or incorrect addresses provided at checkout.</li>
            </ul>
          </section>

          {/* Section 6: Damaged Shipments */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#b5715f]" /> 6. Damaged or Tampered Parcels
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              If the outer box or bag appears opened, severely torn, or tampered with at the time of delivery, please <strong>refuse to accept the package</strong> and report it immediately to our team at <strong>support@avyfashion.com</strong> along with a picture of the outer parcel.
            </p>
          </section>

          {/* Section 7: Support & Contact Info */}
          <section className="mt-8 p-6 sm:p-8 bg-[#fdf2ee] rounded-2xl border border-[#e9c9b8]">
            <h3 className="text-lg font-serif font-bold text-[#5c2430] mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#b5715f]" /> Shipping Support & Inquiries
            </h3>
            <p className="text-sm text-[#6e5048] mb-4">
              Need assistance with your ongoing shipment or tracking status? Contact us directly:
            </p>
            <div className="space-y-2 text-sm text-[#5c2430] font-medium">
              <p><strong>Brand Name:</strong> AVY Fashion Group</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#b5715f]" /> 
                <span><strong>Support Email:</strong> support@avyfashion.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#b5715f] mt-1 shrink-0" />
                <span><strong>Warehouse Address:</strong> NEAR MAIN MARKET, NEWAII-304022, Rajasthan, India</span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}