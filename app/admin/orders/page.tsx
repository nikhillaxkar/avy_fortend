"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Loader2, 
  Calendar, 
  Phone, 
  MapPin, 
  User, 
  CreditCard, 
  PackageCheck, 
  ChevronDown, 
  ChevronUp,
  Trash2,
  RefreshCw
} from "lucide-react";

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderItem {
  _id: string;
  title: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface UserInfo {
  _id: string;
  email: string;
  phone: string;
}

interface Order {
  _id: string;
  orderId: string;
  user?: UserInfo;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  totalItems: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const ORDER_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Loading states for individual actions
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 1. Fetch All Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      
      const response = await fetch(`${baseUrl}/admin/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.orders) {
        setOrders(data.orders);
        setErrorMsg("");
      } else {
        setErrorMsg(data.message || "Failed to load orders list.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMsg("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Update Order Status (PUT API Call)
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("adminToken");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${baseUrl}/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await response.json();

      if (response.ok || data.success) {
        // UI instantly update
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 3. Delete Order (DELETE API Call)
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      setDeletingId(orderId);
      const token = localStorage.getItem("adminToken");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${baseUrl}/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success || response.ok) {
        setOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId));
      } else {
        alert(data.message || "Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order.");
    } finally {
      setDeletingId(null);
    }
  };

  // Search Filter logic
  const filteredOrders = orders.filter((order) => {
    const query = searchTerm.toLowerCase();
    const orderIdMatch = order.orderId?.toLowerCase().includes(query);
    const nameMatch = order.shippingAddress?.fullName?.toLowerCase().includes(query);
    const phoneMatch = order.shippingAddress?.phone?.includes(query);
    return orderIdMatch || nameMatch || phoneMatch;
  });

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Status Styling Helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "CONFIRMED":
        return "bg-purple-50 text-purple-700 border-purple-300";
      case "SHIPPED":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-300";
      default:
        return "bg-slate-50 text-slate-700 border-slate-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin text-black" size={40} />
          <p className="text-sm font-medium text-slate-500">Loading all orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 pb-10">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-900">
              <ShoppingBag size={24} className="text-black shrink-0" /> Customer Orders
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Total <span className="font-semibold text-black">{orders.length}</span> orders placed in system.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchOrders}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition shrink-0"
              title="Refresh List"
            >
              <RefreshCw size={18} />
            </button>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search Order ID, Name, Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-4 text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-8 sm:p-12 text-center text-slate-500 text-sm">
            No orders found matching your search.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              const isUpdating = updatingId === order._id;
              const isDeleting = deletingId === order._id;
              
              return (
                <div key={order._id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition">
                  {/* Summary Bar */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
                    <div className="space-y-2 lg:space-y-1">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="font-mono text-xs sm:text-sm font-bold text-black bg-slate-100 px-2.5 py-1 rounded-lg">
                          {order.orderId}
                        </span>

                        {/* STATUS DROPDOWN SELECTION */}
                        <div className="relative flex items-center">
                          {isUpdating ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                              <Loader2 size={13} className="animate-spin" /> Updating...
                            </div>
                          ) : (
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`text-xs font-bold px-2.5 sm:px-3 py-1 rounded-lg border outline-none cursor-pointer transition ${getStatusBadgeStyle(
                                order.orderStatus
                              )}`}
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status} className="bg-white text-slate-900 font-medium">
                                  {status}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                        <Calendar size={13} className="shrink-0" /> 
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="text-sm text-slate-700 space-y-0.5 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                      <p className="font-semibold flex items-center gap-1.5 text-slate-900 text-xs sm:text-sm">
                        <User size={15} className="text-slate-400 shrink-0" /> {order.shippingAddress?.fullName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400 shrink-0" /> {order.shippingAddress?.phone}
                      </p>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-5 border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                      <div>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase">Total Amount</p>
                        <p className="text-base sm:text-lg font-bold text-slate-900">₹{order.totalAmount}</p>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <CreditCard size={13} /> {order.paymentMethod}
                        </span>
                        <span className={`text-[11px] font-bold mt-0.5 ${
                          order.paymentStatus === "PENDING" ? "text-amber-600" : "text-emerald-600"
                        }`}>
                          ● {order.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Delete Action */}
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          disabled={isDeleting}
                          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition"
                          title="Delete Order"
                        >
                          {isDeleting ? <Loader2 size={18} className="animate-spin text-rose-600" /> : <Trash2 size={18} />}
                        </button>

                        {/* Expand / Collapse Button */}
                        <button
                          onClick={() => toggleExpandOrder(order._id)}
                          className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition"
                        >
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detailed View */}
                  {isExpanded && (
                    <div className="bg-slate-50/70 border-t border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        
                        {/* Shipping Address Details */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 sm:space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin size={14} /> Shipping Address
                          </h4>
                          <p className="text-sm font-semibold text-slate-900">{order.shippingAddress?.fullName}</p>
                          <p className="text-xs text-slate-600">{order.shippingAddress?.address}</p>
                          <p className="text-xs text-slate-600">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                          </p>
                          <p className="text-xs text-slate-600 font-medium pt-1">
                            Phone: {order.shippingAddress?.phone}
                          </p>
                        </div>

                        {/* Account User Info */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 sm:space-y-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <User size={14} /> Account Details
                          </h4>
                          <p className="text-xs text-slate-600">
                            <span className="font-medium text-slate-800">Email:</span> {order.user?.email || "N/A"}
                          </p>
                          <p className="text-xs text-slate-600">
                            <span className="font-medium text-slate-800">Account Phone:</span> {order.user?.phone || "N/A"}
                          </p>
                          <p className="text-xs text-slate-600">
                            <span className="font-medium text-slate-800">Total Ordered Items:</span> {order.totalItems} pcs
                          </p>
                        </div>
                      </div>

                      {/* Items Table / Grid */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-3 bg-slate-100/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                          <PackageCheck size={14} /> Order Items ({order.orderItems?.length})
                        </div>
                        <div className="divide-y divide-slate-100">
                          {order.orderItems?.map((item) => (
                            <div key={item._id} className="p-3.5 flex items-center justify-between gap-3 sm:gap-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-slate-200 bg-slate-50 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-0.5">
                                    <span>Size: <strong className="text-black">{item.size}</strong></span>
                                    <span>Qty: <strong className="text-black">{item.quantity}</strong></span>
                                    <span className="hidden sm:inline">Price: ₹{item.price}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">₹{item.totalPrice}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}