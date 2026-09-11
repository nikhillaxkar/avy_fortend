"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, Plus, Loader2, Package, Search } from "lucide-react";

interface SizeVariant {
  size: string;
  stock: number;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  images: string[];
  sizes: SizeVariant[];
}

export default function AllProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/GetAll`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setErrorMsg(data.message || "Failed to load products.");
        }
      } catch (error) {
        console.error(error);
        setErrorMsg("Server se connect nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Delete Product
  const handleDelete = async (id: string) => {
    if (!window.confirm("Kya aap sach mein yeh product delete karna chahte hain?")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok || data.success) {
        setProducts(products.filter((p) => p._id !== id));
        alert("Product successfully delete ho gaya!");
      } else {
        alert(data.message || "Delete karne mein error aaya.");
      }
    } catch (error) {
      console.error(error);
      alert("Backend server se error mila.");
    }
  };

  // Live filter matching state list
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-sm font-medium text-slate-500">Products load ho rahe hain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 pb-10">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-900">
              <Package size={26} className="shrink-0" /> All Products ({products.length})
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">Apne store ke saare products yahan se manage aur edit karein</p>
          </div>
          <Link
            href="/admin/products/add-product"
            className="bg-black text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 shadow-sm"
          >
            <Plus size={18} /> Add New Product
          </Link>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Search & Toolbar Control */}
        <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-2xl flex items-center shadow-sm">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>
        </div>

        {/* Mobile View: Cards Layout */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
              Koi bhi product nahi mila.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <Package size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{product.title}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{product._id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-800 text-[10px] px-2 py-0.5 rounded font-medium">
                        {product.category}
                      </span>
                      <span className="text-xs text-slate-500">Brand: {product.brand}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">₹{product.discountPrice}</div>
                    {product.price > product.discountPrice && (
                      <div className="text-[11px] text-slate-400 line-through">₹{product.price}</div>
                    )}
                  </div>

                  <div>
                    {product.stock > 0 ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        {product.stock} Available
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                      className="p-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-lg transition"
                      title="Edit Product"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table Layout */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 w-20">Image</th>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category / Brand</th>
                  <th className="p-4">Price (INR)</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-center w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-400 font-medium">
                      Koi bhi product nahi mila.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package size={20} className="text-slate-300" />
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-900 line-clamp-1">{product.title}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{product._id}</div>
                      </td>

                      <td className="p-4">
                        <span className="inline-block bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md font-medium">
                          {product.category}
                        </span>
                        <div className="text-xs text-slate-500 mt-1 pl-1">Brand: {product.brand}</div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-slate-900">₹{product.discountPrice}</div>
                        {product.price > product.discountPrice && (
                          <div className="text-xs text-slate-400 line-through">₹{product.price}</div>
                        )}
                      </td>

                      <td className="p-4">
                        {product.stock > 0 ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-green-600">
                              {product.stock} Available
                            </span>
                            <div className="flex gap-1 flex-wrap mt-1">
                              {product.sizes?.map((s) => (
                                <span key={s._id} className="text-[10px] bg-slate-50 border px-1.5 py-0.5 rounded text-slate-600">
                                  {s.size}: {s.stock}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                            Out of Stock
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                            className="p-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-xl transition"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}