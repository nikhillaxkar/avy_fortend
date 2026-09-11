"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { FolderTree, Upload, ArrowLeft, X, Loader2, Save } from "lucide-react";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Next.js 15+ standards ke mutabik params ko unwrap kar rahe hain
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isFeatured: "true",
    totalItems: "0",
  });

  // Backend par saved image URL (Cloudinary link)
  const [existingImage, setExistingImage] = useState<string>("");
  // Nayi select ki hui photo file aur preview URL
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");

  // 1. Fetch Existing Category Details
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/${categoryId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = await response.json();

        if (data.success && data.category) {
          const cat = data.category;
          setFormData({
            name: cat.name || "",
            description: cat.description || "",
            isFeatured: cat.isFeatured?.toString() || "true",
            totalItems: cat.totalItems?.toString() || "0",
          });
          setExistingImage(cat.image || "");
        } else {
          setErrorMsg(data.message || "Category data load nahi ho paya.");
        }
      } catch (error) {
        console.error(error);
        setErrorMsg("Server se connect karne mein samasya aayi.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle New Banner Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const removeNewImage = () => {
    setNewImageFile(null);
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImagePreview("");
  };

  // 2. Submit Updated Category Data (PUT Request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setErrorMsg("Authentication token missing. Please login again.");
      setUpdating(false);
      return;
    }

    try {
      const dataPayload = new FormData();
      dataPayload.append("name", formData.name);
      dataPayload.append("description", formData.description);
      dataPayload.append("isFeatured", formData.isFeatured);
      dataPayload.append("totalItems", formData.totalItems);
      
      // Agar existing image retained hai toh use pass karein, nahi toh blank bhej sakte hain
      dataPayload.append("existingImage", existingImage);

      // Agar user ne nayi photo choose kari hai, toh vahi single save hogi key="image" par
      if (newImageFile) {
        dataPayload.append("image", newImageFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/category/${categoryId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: dataPayload,
      });

      const data = await response.json();
      if (response.ok || data.success) {
        setSuccessMsg("Category updated successfully!");
        if (newImagePreview) URL.revokeObjectURL(newImagePreview);
        setTimeout(() => router.push("/admin/categories"), 2000);
      } else {
        setErrorMsg(data.message || "Failed to update category.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Server side transmission link failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-sm font-medium text-slate-500">Category data load ho raha hai...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 pb-10">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
        
        {/* Header Navigation */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button type="button" onClick={() => router.back()} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition shrink-0 mt-1 sm:mt-0">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-900">
              <FolderTree size={24} className="text-black shrink-0" /> Edit Category
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm break-all">
              Update configuration for ID: <span className="font-mono text-xs text-black">{categoryId}</span>
            </p>
          </div>
        </div>

        {errorMsg && <div className="mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm">{errorMsg}</div>}
        {successMsg && <div className="mb-6 bg-green-50 text-green-600 border border-green-200 rounded-xl p-4 text-sm">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-800">Category Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Description</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black resize-none text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-800">Total Items</label>
              <input type="number" name="totalItems" required value={formData.totalItems} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800">Is Featured</label>
              <select name="isFeatured" value={formData.isFeatured} onChange={handleChange} className="w-full mt-1.5 p-3 bg-white text-slate-900 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm">
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>

          {/* Banner Images Management block */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800">Category Image</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Existing Image Frame */}
              {existingImage && (
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase mb-1.5">Saved Banner</p>
                  <div className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-100 group">
                    <img src={existingImage} alt="Current active banner" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setExistingImage("")} className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition" title="Remove current image">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}

              {/* 2. New Upload Preview Frame */}
              {newImagePreview && (
                <div>
                  <p className="text-[11px] text-green-600 font-bold uppercase mb-1.5 font-sans">New Selected Banner</p>
                  <div className="relative aspect-video rounded-xl border border-green-300 overflow-hidden bg-slate-100 group">
                    <img src={newImagePreview} alt="New selected preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={removeNewImage} className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dropzone wrapper input field */}
            {(!existingImage && !newImagePreview) && (
              <div className="border-2 border-dashed border-slate-300 bg-white rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Upload className="mx-auto text-slate-400 mb-1" size={26} />
                <p className="text-xs text-slate-700 font-semibold">Click here to upload new image</p>
              </div>
            )}
          </div>

          {/* Action trigger button */}
          <button type="submit" disabled={updating} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm mt-6 shadow-md">
            {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {updating ? "Updating Category..." : "Save Category Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}