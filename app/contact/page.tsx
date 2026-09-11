"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Building2, X, Sparkles } from "lucide-react";

// 🎨 AVY Fashion Palette Constants
const AVY = {
  ink: "#5c2430",        // Deep Burgundy
  inkDark: "#3d1720",    // Dark Burgundy
  accent: "#b5715f",     // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8",      // Warm White
  cardBg: "#fdf2ee",     // Soft Blush Card Background
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Dynamic Notification Toast System
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend message submission API endpoint
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/contact`, { ... });
      
      console.log("Contact Query Submitting: ", formData);
      
      // Dynamic fallback simulation
      setTimeout(() => {
        setToastMsg("Thank you! Your inquiry has been successfully sent to our management team.");
        setShowToast(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setToastMsg("Connection error. Please try again later.");
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fffaf8] text-[#5c2430] min-h-screen font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. HEADER / BREADCRUMB BANNER                                             */}
      {/* ========================================================================= */}
      <div className="bg-[#fdf2ee]/60 py-12 sm:py-16 px-4 border-b border-[#e9c9b8]/60 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-3">
          <Sparkles size={13} style={{ color: AVY.accent }} />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: AVY.ink }}>
            CLIENT SUPPORT INQUIRIES
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight" style={{ color: AVY.ink }}>
          Contact AVY Fashion
        </h1>
        <p className="text-[#8c6b63] text-xs sm:text-sm max-w-md mx-auto mt-3 font-medium">
          Have queries regarding orders, product sizes, or custom bridal requests? Reach out to us directly.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 2. SPLIT INTERFACE: FORM GRID & DETAILS WRAPPER                           */}
      {/* ========================================================================= */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDEBAR SECTION: REGISTERED BUSINESS DETAILS */}
          <div className="lg:col-span-5 bg-[#3d1720] text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-[#b5715f]/30 shadow-xl space-y-8 relative overflow-hidden">
            {/* Background Light Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#b5715f]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#e9c9b8] uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#b5715f]/20 border border-[#b5715f]/30">
                GST Registered Firm
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#e9c9b8] tracking-wide pt-2">
                AVY Fashion Group
              </h2>
              <p className="text-[#e9c9b8]/80 text-xs sm:text-sm leading-relaxed">
                Official business location and verified contact channel metrics.
              </p>
            </div>

            {/* Core Info Rows */}
            <div className="space-y-6">
              
              {/* Location channel */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-[#e9c9b8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#e9c9b8]/60 uppercase tracking-widest">Principal Business Address</p>
                  <p className="text-sm font-medium text-white/90 leading-relaxed">
                    NEAR MAIN MARKET, NEWAII<br />
                    304022, Rajasthan, India
                  </p>
                </div>
              </div>

              {/* Legal Name Channel */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-[#e9c9b8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Building2 size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#e9c9b8]/60 uppercase tracking-widest">Proprietorship / Entity</p>
                  <p className="text-sm font-medium text-white/90 leading-snug">
                    Shivraj Sain <span className="text-xs text-[#e9c9b8]/70">(Proprietor)</span>
                  </p>
                </div>
              </div>

              {/* Call Channel */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-[#e9c9b8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#e9c9b8]/60 uppercase tracking-widest">Helpline Number</p>
                  <a href="tel:+916376774470" className="text-sm font-medium text-white/90 hover:text-[#e9c9b8] transition-colors block">
                    +91 63767 74470
                  </a>
                </div>
              </div>

              {/* Email channel */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-[#e9c9b8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#e9c9b8]/60 uppercase tracking-widest">Official Email Desk</p>
                  <a 
                    href="mailto:stylehubcollection63@gmail.com" 
                    className="text-sm font-medium text-white/90 hover:text-[#e9c9b8] transition-colors break-all block"
                  >
                    stylehubcollection63@gmail.com
                  </a>
                </div>
              </div>

              {/* Hours Channel */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 text-[#e9c9b8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-[#e9c9b8]/60 uppercase tracking-widest">Working Hours</p>
                  <p className="text-sm font-medium text-white/90 leading-tight">
                    Monday – Saturday<br />10:00 AM – 07:00 PM IST
                  </p>
                </div>
              </div>

            </div>

            {/* Bottom Statement */}
            <div className="pt-6 border-t border-white/10 text-[11px] text-[#e9c9b8]/60 tracking-wider leading-relaxed">
              *Registered under GST Registration Rules Govt. of India (Form GST REG-06).
            </div>

          </div>

          {/* RIGHT SIDEBAR SECTION: INQUIRY FORM */}
          <div className="lg:col-span-7 bg-white border border-[#efdcd2] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#5c2430] tracking-tight">
                Send Us A Message
              </h3>
              <p className="text-[#8c6b63] text-xs sm:text-sm">
                Fill out the form below to dispatch an inquiry directly to our desk.
              </p>
            </div>

            {/* Interactive Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5c2430] block">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="block w-full px-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/50 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5c2430] block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="block w-full px-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/50 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5c2430] block">Subject Topic</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Product Inquiry / Order Update"
                  className="block w-full px-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/50 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
                />
              </div>

              {/* Message Payload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5c2430] block">Message Body</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your details or question here..."
                  className="block w-full px-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/50 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent resize-none transition-all"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#5c2430] text-[#e9c9b8] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-[#3d1720] transition-all shadow-md group disabled:bg-gray-400 disabled:text-white cursor-pointer"
                >
                  {loading ? "Sending Message..." : "Send Message"}
                  {!loading && <Send size={13} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* TOAST NOTIFICATION                                                        */}
      {/* ========================================================================= */}
      <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 flex items-center gap-3 bg-[#3d1720] text-white border border-[#b5715f]/40 pl-4 pr-5 py-4 rounded-2xl shadow-2xl max-w-sm
        ${showToast ? "translate-x-0 opacity-100 shadow-[#5c2430]/20" : "translate-x-full opacity-0 pointer-events-none"}
      `}>
        <div className="w-8 h-8 rounded-full bg-[#b5715f]/20 text-[#e9c9b8] flex items-center justify-center flex-shrink-0">
          <MessageSquare size={15} />
        </div>
        
        <div className="flex-1 pr-2">
          <p className="text-[10px] font-bold text-[#e9c9b8] uppercase tracking-widest mb-0.5">
            Support Desk
          </p>
          <p className="text-xs font-medium text-white/95 line-clamp-2 leading-tight">
            {toastMsg}
          </p>
        </div>

        <button 
          onClick={() => setShowToast(false)}
          className="text-[#e9c9b8]/60 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

    </div>
  );
}