"use client";

import React from "react";
import Link from "next/link";
import {
  RefreshCw,
  ShieldCheck,
  Clock,
  CheckCircle,
  RotateCcw,
  CreditCard,
  Truck,
  AlertCircle,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

// 🎨 AVY Fashion Palette
const AVY = {
  ink: "#5c2430", // Deep Burgundy
  inkDark: "#3d1720", // Dark Burgundy
  accent: "#b5715f", // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8", // Warm White
  cardBg: "#fdf2ee", // Soft Blush Card Background
};

export default function AVYRefundPolicyPage() {
  return (
    <div className="bg-[#fffaf8] text-[#5c2430] min-h-screen font-sans antialiased">
      {/* ========================================================================= */}
      {/* SECTION 1: HEADER & BREADCRUMB */}
      {/* ========================================================================= */}
      <div className="bg-[#fdf2ee]/60 py-16 px-4 border-b border-[#e9c9b8]/60 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-3">
          <Sparkles size={13} style={{ color: AVY.accent }} />
          <span
            className="text-[11px] font-bold tracking-[0.2em] uppercase"
            style={{ color: AVY.ink }}
          >
            CRAFTED WITH PASSION & PURITY
          </span>
        </div>
        <h1
          className="text-3xl sm:text-5xl font-serif font-bold tracking-tight"
          style={{ color: AVY.ink }}
        >
          Return, Exchange & Refund Policy
        </h1>
        <p className="text-[#8c6b63] text-xs mt-3 uppercase tracking-widest font-semibold">
          <Link href="/" className="hover:text-[#5c2430] transition-colors">
            Home
          </Link>{" "}
          / <span style={{ color: AVY.accent }}>Refund Policy</span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST BADGES STRIP */}
      {/* ========================================================================= */}
      <div className="bg-[#5c2430] text-[#fffaf8] py-6 px-4 shadow-md">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <RefreshCw className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              EASY 7-DAY RETURNS
            </span>
            <span className="text-[#e9c9b8]/80 text-[11px]">
              Hassle-Free Doorstep Pickup
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <Clock className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              REAL-TIME REFUND SYNC
            </span>
            <span className="text-[#e9c9b8]/80 text-[11px]">
              5-7 Business Days Processing
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <RotateCcw className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              FREE SIZE EXCHANGE
            </span>
            <span className="text-[#e9c9b8]/80 text-[11px]">
              Quick & Convenient Swaps
            </span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              PAYU SECURE GATEWAY
            </span>
            <span className="text-[#e9c9b8]/80 text-[11px]">
              Direct Source Refunds
            </span>
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
              At <strong style={{ color: AVY.ink }}>AVY Fashion Group</strong>,
              customer delight and transparency are our highest priorities. If
              you are not completely satisfied with your kurti or ethnic
              ensemble, we offer a straightforward, hassle-free{" "}
              <strong>7-Day Return and Exchange policy</strong>.
            </p>
          </div>

          {/* Section 1: Return Eligibility */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#b5715f]" /> 1. Return &
              Exchange Eligibility Guidelines
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              To ensure a smooth processing of your return or size exchange,
              please review the conditions below:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li>
                <strong>Time Window:</strong> Return or exchange requests must
                be raised within <strong>7 days</strong> from the delivery
                timestamp.
              </li>
              <li>
                <strong>Condition:</strong> Garments must be unwashed, unworn,
                unused, and free of odors, stains, or alterations.
              </li>
              <li>
                <strong>Original Packaging:</strong> Products must retain all
                original brand tags, price labels, and polybags intact.
              </li>
              <li>
                <strong>Defects/Damage:</strong> In case of manufacturing
                defects or receiving a damaged/wrong product, please notify us
                within 48 hours of delivery with photo/video proof.
              </li>
            </ul>
          </section>

          {/* Section 2: Order Cancellation */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#b5715f]" /> 2. Order Cancellation
              Policy
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              We process orders in real-time to guarantee speedy dispatches.
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li>
                <strong>Pre-Dispatch Cancellations:</strong> You can cancel an
                order free of cost before it has been dispatched from our
                warehouse. The full amount will be refunded instantly to your
                original payment mode.
              </li>
              <li>
                <strong>Post-Dispatch Cancellations:</strong> Once dispatched,
                orders cannot be canceled in transit. However, you can reject
                the parcel at delivery or initiate a return upon receiving it.
              </li>
            </ul>
          </section>

          {/* Section 3: Refund Process & Timelines */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#b5715f]" /> 3. Real-Time
              Refund Processing & Timelines
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              Once the returned item is picked up and passes quality inspection
              at our fulfillment facility:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl space-y-1">
                <h3 className="font-serif font-bold text-[#5c2430] text-sm">
                  Prepaid Payments (PayU / UPI / Cards)
                </h3>
                <p className="text-xs text-[#6e5048] leading-relaxed">
                  Refunds are sent directly through our payment partner (PayU)
                  to your original payment channel within{" "}
                  <strong>5 to 7 business days</strong>.
                </p>
              </div>
              <div className="p-5 bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl space-y-1">
                <h3 className="font-serif font-bold text-[#5c2430] text-sm">
                  Cash on Delivery (COD) Orders
                </h3>
                <p className="text-xs text-[#6e5048] leading-relaxed">
                  Refunds are credited directly via UPI ID or Direct Bank
                  Transfer (NEFT/IMPS) within{" "}
                  <strong>3 to 5 business days</strong> after receiving account
                  details.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Non-Returnable Items */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#b5715f]" /> 4.
              Non-Returnable Categories
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              For hygiene and operational reasons, the following items cannot be
              returned or refunded unless received in a damaged state:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li>Custom-tailored or altered kurtis.</li>
              <li>
                Clearance sale or end-of-season final sale items (unless
                defective).
              </li>
              <li>
                Products returned without original tags and brand packaging.
              </li>
            </ul>
          </section>

          {/* Section 5: How to Initiate a Return */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#b5715f]" /> 5. How to Submit a
              Return Request
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              Initiating a return is simple and fast:
            </p>
            <ol className="list-decimal pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li>
                Email us at <strong>support@avyfashion.com</strong> or WhatsApp
                us with your <strong>Order ID</strong> and product photo.
              </li>
              <li>
                Our support team will approve the request within 24 hours and
                arrange a doorstep reverse pickup via our logistics partner.
              </li>
              <li>
                Keep the parcel sealed with tags attached. The courier agent
                will collect it directly from your address.
              </li>
            </ol>
          </section>

          {/* Section 6: Official Support & Contact Info */}
          <section className="mt-8 p-6 sm:p-8 bg-[#fdf2ee] rounded-2xl border border-[#e9c9b8]">
            <h3 className="text-lg font-serif font-bold text-[#5c2430] mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#b5715f]" /> Return & Refund
              Support Helpdesk
            </h3>
            <p className="text-sm text-[#6e5048] mb-4">
              If you have any questions regarding your ongoing returns or
              pending refunds, please reach out:
            </p>
            <div className="space-y-2 text-sm text-[#5c2430] font-medium">
              <p>
                <strong>Brand Name:</strong> AVY Fashion Group
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#b5715f]" />
                <span>
                  <strong>Support Email:</strong> support@avyfashion.com
                </span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#b5715f] mt-1 shrink-0" />
                <span>
                  <strong>Address:</strong> NEAR MAIN MARKET, NEWAII-304022,
                  Rajasthan, India
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
