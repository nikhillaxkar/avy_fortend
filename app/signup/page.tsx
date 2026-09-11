"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// 🎨 AVY Fashion Luxury Palette (Matching Login Page Theme)
const AVY = {
  ink: "#5c2430", // Deep Burgundy
  inkDark: "#3d1720", // Dark Burgundy
  accent: "#b5715f", // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8", // Warm White
  cardBg: "#fdf2ee", // Soft Blush Card Background
};

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        console.log("User registered successfully!");
        router.push("/login");
      } else {
        setErrorMsg(data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Signup Submission Error: ", err);
      setErrorMsg(
        "Server connection failed. Please check if your backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fffaf8] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#5c2430]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-[#efdcd2] shadow-sm p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative Luxury Glow Accent */}
        <div
          className="absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40"
          style={{ backgroundColor: AVY.accentSoft }}
        ></div>

        {/* Branding Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#e9c9b8] bg-[#fdf2ee] mb-1">
            <Sparkles size={12} style={{ color: AVY.accent }} />
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: AVY.ink }}
            >
              AVY FASHION GROUP
            </span>
          </div>

          <div className="relative w-16 h-16 mx-auto mb-2">
            <Image
              src="/avy_logo.png"
              alt="AVY Fashion Group Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight"
            style={{ color: AVY.ink }}
          >
            Create Account
          </h2>
          <p className="text-[#8c6b63] text-xs uppercase tracking-widest font-semibold">
            Join the AVY Fashion Family
          </p>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-700 leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5c2430] block">
              Full Name
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b5715f]">
                <User size={18} />
              </div>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="block w-full pl-11 pr-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/60 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5c2430] block">
              Email Address
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b5715f]">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="support@avyfashion.com"
                className="block w-full pl-11 pr-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/60 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5c2430] block">
              Phone Number
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b5715f]">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="block w-full pl-11 pr-4 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/60 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#5c2430] block">
              Password
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b5715f]">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full pl-11 pr-11 py-3 border border-[#efdcd2] rounded-xl bg-[#fdf2ee]/40 text-sm text-[#5c2430] placeholder-[#8c6b63]/60 focus:outline-none focus:ring-2 focus:ring-[#b5715f] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8c6b63] hover:text-[#5c2430] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Trigger Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5c2430] text-[#fffaf8] font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-[#3d1720] active:scale-[0.99] transition-all shadow-md group disabled:bg-[#8c6b63] disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Sign Up"}
              {!loading && (
                <ArrowRight
                  size={14}
                  className="transform group-hover:translate-x-0.5 transition-transform text-[#e9c9b8]"
                />
              )}
            </button>
          </div>
        </form>

        {/* Redirect to Login */}
        <div className="mt-8 pt-5 border-t border-[#efdcd2] text-center text-xs text-[#8c6b63]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#5c2430] font-bold uppercase tracking-wider hover:underline ml-1"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
