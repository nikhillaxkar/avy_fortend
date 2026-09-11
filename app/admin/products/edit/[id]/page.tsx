"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload, Plus, Trash2, ArrowLeft, X, Loader2 } from "lucide-react";

interface SizeVariant {
  size: string;
  stock: number;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params using React.use() as per Next.js 15+ standards
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "",
    isFeatured: "true",
    isPremium: "true",
    isOnSale: "false",
    isTrending: "true",
  });

  const [sizes, setSizes] = useState<SizeVariant[]>([{ size: "M", stock: 10 }]);
  
  // Pehle se backend par saved images URLs (Cloudinary links)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Nayi select ki hui actual files
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  // Nayi select ki hui files ke live browser previews (Blobs)
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // 1. Fetch Existing Product Data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/Getsingle/${productId}`);
        const data = await response.json();

        if (data.success && data.product) {
          const prod = data.product;
          setFormData({
            title: prod.title || "",
            description: prod.description || "",
            brand: prod.brand || "",
            category: prod.category || "",
            price: prod.price?.toString() || "",
            discountPrice: prod.discountPrice?.toString() || "",
            stock: prod.stock?.toString() || "",
            isFeatured: prod.isFeatured?.toString() || "true",
            isPremium: prod.isPremium?.toString() || "true",
            isOnSale: prod.isOnSale?.toString() || "false",
            isTrending: prod.isTrending?.toString() || "true",
          });
          setSizes(prod.sizes || [{ size: "M", stock: 10 }]);
          setExistingImages(prod.images || []);
        } else {
          setErrorMsg(data.message || "Product data fetch karne mein dikkat aayi.");
        }
      } catch (error) {
        console.error(error);
        setErrorMsg("Server se purana data load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle New File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImageFiles((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove Existing Cloudinary Image
  const removeExistingImage = (indexToRemove: number) => {
    setExistingImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Remove Newly Selected Image
  const removeNewImage = (indexToRemove: number) => {
    setNewImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(newImagePreviews[indexToRemove]);
    setNewImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSizeChange = (index: number, field: "size" | "stock", value: string | number) => {
    const updatedSizes = [...sizes];
    if (field === "stock") {
      updatedSizes[index].stock = Number(value);
    } else {
      updatedSizes[index].size = String(value);
    }
    setSizes(updatedSizes);
  };

  const addSizeField = () => setSizes([...sizes, { size: "", stock: 0 }]);
  const removeSizeField = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  // 2. Submit Updated Data
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

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setErrorMsg("Kamm se kamm ek product image rakhna zaroori hai.");
      setUpdating(false);
      return;
    }

    try {
      const dataPayload = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, value]) => dataPayload.append(key, value));
      dataPayload.append("sizes", JSON.stringify(sizes));
      
      // Jo purani images retained hain unhe JSON array banakar bhej rahe hain
      dataPayload.append("existingImages", JSON.stringify(existingImages));

      // Nayi upload ki hui binary files ko append kar rahe hain
      newImageFiles.forEach((file) => dataPayload.append("images", file));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit/product/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: dataPayload,
      });

      const data = await response.json();
      if (response.ok || data.success) {
        setSuccessMsg("Product updated successfully!");
        newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setTimeout(() => router.push("/admin/products"), 2000);
      } else {
        setErrorMsg(data.message || "Failed to update product.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Server se communication failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-sm font-medium text-slate-500">Product details load ho rahi hain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 pb-10">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button type="button" onClick={() => router.back()} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-900">
              <Package size={24} className="text-black shrink-0" /> Edit Product
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm break-all">
              Modify information for ID: <span className="font-mono text-xs text-black">{productId}</span>
            </p>
          </div>
        </div>

        {errorMsg && <div className="mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm">{errorMsg}</div>}
        {successMsg && <div className="mb-6 bg-green-50 text-green-600 border border-green-200 rounded-xl p-4 text-sm">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-800">Product Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Brand</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Category</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-800">Price</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Discount</label>
                <input type="number" name="discountPrice" required value={formData.discountPrice} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Stock</label>
                <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Description</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black resize-none text-sm" />
          </div>

          {/* Sizes Variant */}
          <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-slate-800">Product Sizes & Variants</label>
              <button type="button" onClick={addSizeField} className="text-xs sm:text-sm bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-800 transition">
                <Plus size={14} /> Add Variant
              </button>
            </div>
            {sizes.map((item, index) => (
              <div key={index} className="flex gap-2 sm:gap-4 items-center mt-2">
                <input type="text" required placeholder="Size" value={item.size} onChange={(e) => handleSizeChange(index, "size", e.target.value)} className="w-1/2 p-2.5 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none text-sm" />
                <input type="number" required placeholder="Stock" value={item.stock} onChange={(e) => handleSizeChange(index, "stock", e.target.value)} className="w-1/2 p-2.5 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none text-sm" />
                {sizes.length > 1 && (
                  <button type="button" onClick={() => removeSizeField(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition shrink-0">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
            {["isFeatured", "isPremium", "isOnSale", "isTrending"].map((toggle) => (
              <div key={toggle}>
                <label className="text-[11px] font-bold text-slate-500 uppercase">{toggle.replace("is", "Is ")}</label>
                <select name={toggle} value={(formData as any)[toggle]} onChange={handleChange} className="w-full mt-1 p-2 bg-white text-slate-900 rounded-lg border border-slate-300 text-xs sm:text-sm outline-none">
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            ))}
          </div>

          {/* Images Controller Block */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-800">Product Images</label>
            
            {/* 1. Existing Active Images List */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-[11px] text-slate-400 font-bold uppercase mb-2">Saved Images (Cloudinary)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group bg-slate-100 shadow-sm">
                      <img src={url} alt="Existing product" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dropzone field to append new items */}
            <div className="border-2 border-dashed border-slate-300 bg-white rounded-2xl p-5 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input type="file" multiple name="images" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="mx-auto text-slate-400 mb-1.5" size={28} />
              <p className="text-xs sm:text-sm text-slate-700 font-medium">Click to add new images</p>
            </div>

            {/* 2. New Previews List */}
            {newImagePreviews.length > 0 && (
              <div>
                <p className="text-[11px] text-green-600 font-bold uppercase mb-2">Newly Uploaded Previews (To be saved)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {newImagePreviews.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-xl border border-green-300 overflow-hidden group bg-slate-100 shadow-sm">
                      <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={updating} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm shadow-md mt-6">
            {updating ? <Loader2 className="animate-spin" size={18} /> : null}
            {updating ? "Updating Product..." : "Update Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}