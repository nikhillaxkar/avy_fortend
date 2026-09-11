"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.user));

        const expires = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toUTCString();

        document.cookie = `adminToken=${data.token}; expires=${expires}; path=/`;

        router.push("/admin");
      } else {
        setErrorMsg(data.message || "Invalid Email or Password");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Unable to connect with server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 border border-slate-200/60">

        {/* Brand Icon Header */}
        <div className="flex justify-center mb-4 sm:mb-5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black flex items-center justify-center shadow-md">
            <Shield className="text-white" size={28} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 tracking-tight">
          Admin Login
        </h1>

        <p className="text-center text-slate-500 text-xs sm:text-sm mt-1 mb-6 sm:mb-8">
          Sign in to access your dashboard overview
        </p>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 sm:p-3.5 text-xs sm:text-sm font-medium animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Email Input Field */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-800">
              Email Address
            </label>

            <div className="relative mt-1.5">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-800">
              Password
            </label>

            <div className="relative mt-1.5">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Logging In...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        <div className="mt-6 sm:mt-8 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
          <Shield size={13} />
          <span>Secure Admin Authentication</span>
        </div>

      </div>
    </div>
  );
}