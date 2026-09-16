"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Upload, Plus, Trash2, ArrowLeft, X, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    category: "",
    productType: "kurti", // Default value added
    price: "",
    discountPrice: "",
    stock: "",
    isFeatured: "true",
    isPremium: "true",
    isOnSale: "false",
    isTrending: "true",
  });

  const [sizes, setSizes] = useState<{ size: string; stock: number }[]>([
    { size: "M", stock: 10 },
  ]);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setErrorMsg("Authentication token not found. Please login again.");
      setLoading(false);
      return;
    }

    if (imageFiles.length === 0) {
      setErrorMsg("Kam se kam ek product image upload karna zaroori hai.");
      setLoading(false);
      return;
    }

    try {
      const dataPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => dataPayload.append(key, value));

      // Saree ke liye empty array, baaki ke liye actual sizes array pass hoga
      const finalSizes = formData.productType === "saree" ? [] : sizes;
      dataPayload.append("sizes", JSON.stringify(finalSizes));

      imageFiles.forEach((file) => dataPayload.append("images", file));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: dataPayload,
      });

      const data = await response.json();
      if (response.ok || data.success) {
        setSuccessMsg("Product added successfully!");
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        setTimeout(() => router.push("/admin/products"), 2000);
      } else {
        setErrorMsg(data.message || "Failed to add product.");
      }
    } catch (error) {
      setErrorMsg("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

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
              <Package size={24} className="text-black shrink-0" /> Add New Product
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">Fill in details to launch your product</p>
          </div>
        </div>

        {/* Notifications */}
        {errorMsg && <div className="mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm">{errorMsg}</div>}
        {successMsg && <div className="mb-6 bg-green-50 text-green-600 border border-green-200 rounded-xl p-4 text-sm">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Main Info Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-800">Product Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Kurtiya 2" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Brand</label>
              <input type="text" name="brand" required value={formData.brand} onChange={handleChange} placeholder="Style Hub" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">Category</label>
              <input type="text" name="category" required value={formData.category} onChange={handleChange} placeholder="Ethnic Wear" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
            </div>

            {/* Product Type Dropdown */}
            <div>
              <label className="text-sm font-semibold text-slate-800">Product Type</label>
              <select name="productType" value={formData.productType} onChange={handleChange} className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm capitalize">
                {["kurti", "saree", "top", "shirt", "dress", "jeans", "other"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:col-span-2">
              <div>
                <label className="text-sm font-semibold text-slate-800">Price</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} placeholder="1000" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Discount Price</label>
                <input type="number" name="discountPrice" required value={formData.discountPrice} onChange={handleChange} placeholder="500" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Total Stock</label>
                <input type="number" name="stock" required value={formData.stock} onChange={handleChange} placeholder="10" className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-800">Description</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} placeholder="Product features and specifications..." className="w-full mt-1.5 p-3 text-slate-900 placeholder:text-slate-400 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black resize-none text-sm" />
          </div>

          {/* Dynamic Sizes Section (Saree ke liye HIDE ho jayega) */}
          {formData.productType !== "saree" && (
            <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-800">Product Sizes & Stock Variant</label>
                <button type="button" onClick={addSizeField} className="text-xs sm:text-sm bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-slate-800 transition">
                  <Plus size={14} /> Add Variant
                </button>
              </div>
              {sizes.map((item, index) => (
                <div key={index} className="flex gap-2 sm:gap-4 items-center mt-2">
                  <input type="text" required placeholder="Size (e.g. M, L)" value={item.size} onChange={(e) => handleSizeChange(index, "size", e.target.value)} className="w-1/2 p-2.5 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none text-sm" />
                  <input type="number" required placeholder="Stock" value={item.stock} onChange={(e) => handleSizeChange(index, "stock", e.target.value)} className="w-1/2 p-2.5 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none text-sm" />
                  {sizes.length > 1 && (
                    <button type="button" onClick={() => removeSizeField(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition shrink-0">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Toggle Switches */}
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

          {/* File Upload Section */}
          <div>
            <label className="text-sm font-semibold text-slate-800">Product Images</label>
            <div className="mt-1.5 border-2 border-dashed border-slate-300 bg-white rounded-2xl p-5 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input type="file" multiple name="images" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="mx-auto text-slate-400 mb-1.5" size={28} />
              <p className="text-xs sm:text-sm text-slate-700 font-medium">Click to upload files or drag and drop</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Select multiple images at once or one by one</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative aspect-square w-full rounded-xl border border-slate-200 bg-slate-100 overflow-hidden group shadow-sm">
                    <img 
                      src={previewUrl} 
                      alt={`Preview ${index}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-sm shadow-md mt-6">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}