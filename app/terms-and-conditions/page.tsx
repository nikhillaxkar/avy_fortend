"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  Mail, 
  MapPin,
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

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h1>
        <p className="text-[#8c6b63] text-xs mt-3 uppercase tracking-widest font-semibold">
          <Link href="/" className="hover:text-[#5c2430] transition-colors">Home</Link> / <span style={{ color: AVY.accent }}>Terms & Conditions</span>
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUST BADGES STRIP */}
      {/* ========================================================================= */}
      <div className="bg-[#5c2430] text-[#fffaf8] py-6 px-4 shadow-md">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">100% SECURE CHECKOUT</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">PayU Protected Gateway</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <Clock className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">REAL-TIME SYNC</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">Instant Order Confirmation</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <Scale className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">TRANSPARENT TERMS</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">Fair & Clear Policies</span>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <CheckCircle className="w-6 h-6 text-[#e9c9b8]" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">GENUINE PRODUCTS</span>
            <span className="text-[#e9c9b8]/80 text-[11px]">100% Quality Assurance</span>
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
              Welcome to <strong style={{ color: AVY.ink }}>AVY Fashion Group</strong>. By accessing our platform, browsing our ethnic wear collections, or making a purchase, you agree to abide by the terms, guidelines, and conditions detailed below. Please read them thoroughly before completing your order.
            </p>
          </div>

          {/* Section 1: Business Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#b5715f]" /> 1. General Agreement & Business Information
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              This website is managed and operated by AVY Fashion Group. Throughout the website, the terms "we", "us", and "our" refer to AVY Fashion Group. We reserve the right to revise or modify any portion of these Terms & Conditions at any time by updating this document.
            </p>
          </section>

          {/* Section 2: Products & Fabric Disclaimers */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#b5715f]" /> 2. Products, Fabric & Color Accuracy
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              We specialize in premium ethnic suits, kurtis, and traditional wear. To ensure total transparency:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li><strong>Color Tone Variations:</strong> While we capture product images under professional studio lighting, actual fabric colors may slightly differ due to digital screen settings or mobile display brightness.</li>
              <li><strong>Handicrafts & Embroidery:</strong> Minor variations in thread work, print placement, or hand-block prints are natural characteristics of authentic ethnic garments and are not considered defects.</li>
              <li><strong>Stock Availability:</strong> All products are subject to stock availability in real-time. If an item becomes out of stock after order placement, an instant full refund will be processed.</li>
            </ul>
          </section>

          {/* Section 3: Pricing & Payments */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#b5715f]" /> 3. Pricing & Real-Time Payment Settlements
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              All prices listed on AVY Fashion Group are in Indian Rupees (INR) and are inclusive of all applicable taxes (GST).
            </p>
            <div className="p-5 bg-[#fdf2ee] border border-[#efdcd2] rounded-2xl space-y-1">
              <p className="text-sm text-[#5c2430] font-serif font-bold">Secure Gateway (PayU Integration):</p>
              <p className="text-xs text-[#6e5048] leading-relaxed">
                Prepaid transactions are handled through authorized payment channels like PayU. Your payments are verified in real-time using 256-bit encryption. AVY Fashion Group never asks for or stores sensitive banking pins, passwords, or card CVVs.
              </p>
            </div>
          </section>

          {/* Section 4: Real-Time Order Processing & Shipping */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#b5715f]" /> 4. Real-Time Order Processing & Shipping
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              Once an order is successfully placed and paid for:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li><strong>Dispatch Time:</strong> Orders are verified and dispatched within 24 to 48 hours.</li>
              <li><strong>Real-Time Tracking:</strong> A live courier tracking link will be sent via SMS, Email, or WhatsApp immediately upon dispatch.</li>
              <li><strong>Delivery Timeline:</strong> Estimated delivery takes 3 to 5 days for metro cities and 5 to 7 days for other regions across India.</li>
            </ul>
          </section>

          {/* Section 5: Returns, Cancellations & Refunds */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#b5715f]" /> 5. Return, Exchange & Refund Policies
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              We offer a simple 7-Day Return and Exchange option for wrong sizes, damaged items, or manufacturing defects:
            </p>
            <ul className="list-disc pl-5 text-sm md:text-base text-[#6e5048] space-y-2">
              <li><strong>Order Cancellations:</strong> You can cancel your order anytime before it enters the dispatch phase.</li>
              <li><strong>Refund Processing:</strong> Approved refunds for prepaid orders will be sent back through PayU to your original payment mode within 5 to 7 working days.</li>
              <li><strong>Product Condition:</strong> Returned clothes must remain unwashed, unworn, with tags and original packaging undamaged.</li>
            </ul>
          </section>

          {/* Section 6: Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#5c2430] border-b border-[#efdcd2] pb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#b5715f]" /> 6. Intellectual Property Rights
            </h2>
            <p className="text-sm md:text-base text-[#6e5048] leading-relaxed">
              All website graphics, kurti designs, photographs, website layout, and branding materials belong exclusively to <strong style={{ color: AVY.ink }}>AVY Fashion Group</strong>. Any unauthorized copying, distribution, or commercial reuse without explicit written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 7: Support & Contact Info */}
          <section className="mt-8 p-6 sm:p-8 bg-[#fdf2ee] rounded-2xl border border-[#e9c9b8]">
            <h3 className="text-lg font-serif font-bold text-[#5c2430] mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#b5715f]" /> Legal & Support Contact
            </h3>
            <p className="text-sm text-[#6e5048] mb-4">
              If you have any questions regarding these Terms and Conditions or your orders, please feel free to reach out:
            </p>
            <div className="space-y-2 text-sm text-[#5c2430] font-medium">
              <p><strong>Brand Name:</strong> AVY Fashion Group</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#b5715f]" /> 
                <span><strong>Email Support:</strong> support@avyfashion.com</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#b5715f] mt-1 shrink-0" />
                <span><strong>Address:</strong> NEAR MAIN MARKET, RAHOLI-304022, Rajasthan, India</span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}