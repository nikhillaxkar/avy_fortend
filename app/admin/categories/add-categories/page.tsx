"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Upload, Trash2, Loader2, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  isFeatured: boolean | string;
  image?: string;
  totalItems: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isFeatured: "true",
    totalItems: "0",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 1. Fetch Existing Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/get-categpry`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview("");
  };

  // 2. Submit New Category
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      setErrorMsg("Authentication token not found. Please login again.");
      setSubmitting(false);
      return;
    }

    try {
      const dataPayload = new FormData();
      dataPayload.append("name", formData.name);
      dataPayload.append("description", formData.description);
      dataPayload.append("isFeatured", formData.isFeatured);
      dataPayload.append("totalItems", formData.totalItems);

      if (imageFile) {
        dataPayload.append("image", imageFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: dataPayload,
        }
      );

      const data = await response.json();

      if (response.ok || data.success) {
        setSuccessMsg("Category added successfully!");
        setFormData({
          name: "",
          description: "",
          isFeatured: "true",
          totalItems: "0",
        });
        removeSelectedImage();
        fetchCategories();
      } else {
        setErrorMsg(data.message || "Failed to add category.");
      }
    } catch (error) {
      setErrorMsg("Server se connect nahi ho paya.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Category
  const handleDelete = async (id: string) => {
    if (!window.confirm("Kya aap sach mein yeh category delete karna chahte hain?"))
      return;

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/delete/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setCategories(categories.filter((c) => c._id !== id));
        alert("Category deleted successfully.");
      }
    } catch (error) {
      alert("Delete karne mein error aaya.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20 lg:pt-10 pl-4 lg:pl-72 pr-4 lg:pr-10 pb-10 transition-all duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Form Panel: Add Category */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-5 sm:p-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FolderTree className="text-black" size={22} />
            <h2 className="text-xl font-bold">Add Category</h2>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 bg-green-50 text-green-600 border border-green-200 rounded-xl p-3 text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Kurtiya"
                className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-800">
                Description
              </label>
              <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Premium Collection..."
                className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black resize-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-800">
                  Total Items
                </label>
                <input
                  type="number"
                  name="totalItems"
                  required
                  value={formData.totalItems}
                  onChange={handleChange}
                  placeholder="53"
                  className="w-full mt-1.5 p-3 text-slate-900 bg-white rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">
                  Is Featured
                </label>
                <select
                  name="isFeatured"
                  value={formData.isFeatured}
                  onChange={handleChange}
                  className="w-full mt-1.5 p-3 bg-white text-slate-900 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-black text-sm"
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
            </div>

            {/* Image Box */}
            <div>
              <label className="text-sm font-semibold text-slate-800">
                Category Banner Image
              </label>
              {!imagePreview ? (
                <div className="mt-1.5 border-2 border-dashed border-slate-300 bg-white rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="mx-auto text-slate-400 mb-1" size={24} />
                  <p className="text-xs text-slate-600 font-medium">
                    Click to upload banner
                  </p>
                </div>
              ) : (
                <div className="mt-1.5 relative aspect-video w-full rounded-xl border overflow-hidden bg-slate-100 group">
                  <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute top-1.5 right-1.5 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition text-sm flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Plus size={16} />
              )}
              {submitting ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* Right Table Panel: Categories List */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Existing Categories</h2>

          {loading ? (
            <div className="flex flex-col items-center py-12 gap-2">
              <Loader2 className="animate-spin text-black" size={32} />
              <p className="text-xs text-slate-500">
                Categories load ho rahi hain...
              </p>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">
              Koi category available nahi hai.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3 w-16">Banner</th>
                    <th className="p-3">Category Info</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3 text-center w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="p-3">
                        <div className="w-10 h-10 rounded-lg border overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FolderTree
                              size={16}
                              className="text-slate-300"
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">
                          {cat.name}
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1">
                          {cat.description}
                        </div>
                      </td>
                      <td className="p-3 font-medium text-slate-700 whitespace-nowrap">
                        {cat.totalItems} Items
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                            cat.isFeatured?.toString() === "true"
                              ? "bg-green-50 text-green-600 border border-green-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {cat.isFeatured?.toString() === "true"
                            ? "Yes"
                            : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}