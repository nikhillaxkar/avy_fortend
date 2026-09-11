"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  Check,
  X,
  Loader2,
  ShieldCheck,
  LogOut,
  BadgeCheck,
} from "lucide-react";

interface UserProfileData {
  _id: string;
  fullName?: string;
  email: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  // 1. Fetch User Profile Data (Using POST method as per Backend Postman route)
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken");

      if (!token || token === "null" || token === "undefined") {
        setErrorMsg("Please login first to view your profile.");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${baseUrl}/users/userProfile`, {
        method: "POST", // Matching Postman method
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = data.user || data;
        setProfile(userData);

        setFormData({
          fullName: userData.fullName || "",
          phone: userData.phone || "",
        });
      } else {
        if (response.status === 401) {
          setErrorMsg("Session expired or invalid token. Please log in again.");
        } else {
          setErrorMsg(data.message || "Failed to load user profile.");
        }
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      setErrorMsg("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 2. Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setErrorMsg("");
      setSuccessMsg("");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("userToken");

      if (!token) {
        setErrorMsg("Authentication token missing.");
        setUpdating(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${baseUrl}/users/userProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setSuccessMsg("Profile updated successfully!");
        setIsEditing(false);
        fetchUserProfile();
      } else {
        setErrorMsg(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg("Error while saving updates.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-sm font-medium text-slate-500">Loading profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Notifications */}
        {errorMsg && (
          <div className="bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl p-4 text-sm font-medium flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")}><X size={16} /></button>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl p-4 text-sm font-medium flex items-center justify-between">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg("")}><X size={16} /></button>
          </div>
        )}

        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shadow-md">
              {profile?.fullName
                ? profile.fullName.charAt(0).toUpperCase()
                : profile?.email?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{profile?.fullName || "User Account"}</h1>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> {profile?.isActive ? "Active" : "Inactive"}
                </span>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase">
                  {profile?.role || "user"}
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={14} /> {profile?.email}
              </p>
              {profile?.createdAt && (
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <Calendar size={13} /> Member since{" "}
                  {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2.5 bg-black text-white hover:bg-slate-800 rounded-xl text-sm font-medium flex items-center gap-2 transition"
              >
                {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>

              <button
                onClick={handleLogout}
                className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-medium transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info / Edit Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Edit Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-black text-white hover:bg-slate-800 rounded-xl text-sm font-medium flex items-center gap-2 transition"
                >
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <User size={13} /> Full Name
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{profile?.fullName || "Not provided"}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Phone size={13} /> Phone Number
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {profile?.phone || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Mail size={13} /> Email Address
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{profile?.email || "Not provided"}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <BadgeCheck size={13} /> Account Role
                  </span>
                  <p className="text-sm font-semibold text-slate-800 uppercase">{profile?.role || "user"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}