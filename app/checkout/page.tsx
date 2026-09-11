"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, CheckCircle2, X, AlertCircle } from "lucide-react";

interface CartProductItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    images?: string[];
  } | null;
  quantity: number;
  price: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Delivery aur payment details ki state
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>("");

  // =========================================================================
  // 1. GET ACTIVE USER CART DATA
  // =========================================================================
  const fetchCheckoutCartSummary = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authorization token missing. Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/getUserCart`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success && data.cart) {
        setCartProducts(data.cart.products || []);
        setCartTotal(data.cartTotal || 0);
      } else {
        setError("Aapka shopping cart checkout summary load nahi ho paya.");
      }
    } catch (err) {
      console.error(err);
      setError("Backend Server Data Synchronization Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutCartSummary();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // =========================================================================
  // 2. DISPATCH ORDER SUBMISSION
  // =========================================================================
  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitLoading(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Session expire ho chuka hai. Please login again.");
      setSubmitLoading(false);
      return;
    }

    try {
      const postmanPayload = {
        fullName: shippingDetails.fullName,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        pincode: shippingDetails.pincode,
        paymentMethod: shippingDetails.paymentMethod,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/order/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postmanPayload),
        }
      );

      const data = await response.json();

      if (data.success || response.status === 200 || response.status === 201) {
        // ONLINE Payment Redirection Logic
        if (shippingDetails.paymentMethod === "ONLINE") {
          const redirectUrl = data.paymentUrl || data.url || data.redirectUrl || data.payUrl;

          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          } else if (data.order?.orderId) {
            router.push(`/payment-gateway?orderId=${data.order.orderId}`);
            return;
          }
        }

        // COD Modal Logic
        setGeneratedOrderId(
          data.order?.orderId ||
            `STH-${Math.floor(100000 + Math.random() * 900000)}`
        );
        setShowSuccessModal(true);
      } else {
        setError(data.message || "Backend database validation rules mapping error.");
      }
    } catch (err) {
      console.error("Order API Crash Logs: ", err);
      setError("Network pipeline block ya API connectivity drop scenario.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans antialiased">
      {/* Upper Header Layout */}
      <div className="bg-[#fdfbf7] py-12 px-4 border-b border-gray-100 text-center">
        <span className="text-[#c5a854] text-xs font-bold tracking-[0.25em] uppercase block mb-1">
          CHECKOUT GATEWAY INTEGRATION
        </span>
        <h1 className="text-3xl font-bold font-serif text-gray-900 flex items-center justify-center gap-2">
          <ShieldCheck className="text-amber-500" size={26} /> Complete Order
          Checkout
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error Warning Box */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-2xl max-w-xl mx-auto text-center flex items-center justify-center gap-2 shadow-sm">
            <AlertCircle size={18} className="flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="h-40 flex items-center justify-center text-sm font-semibold text-gray-400">
            Parsing Server Architecture Summaries...
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrderSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* LEFT SIDE: DELIVERY FORM */}
            <div className="lg:col-span-7 bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-10 shadow-sm space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-serif text-gray-900">
                  Delivery Address Parameters
                </h2>
                <p className="text-gray-400 text-xs">
                  Aapke shipping location aur delivery parameters.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Field 1: fullName */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Consignee Full Name (fullName)
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={shippingDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Aarav Sharma"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  {/* Field 2: phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Mobile Number (phone)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingDetails.phone}
                      onChange={handleInputChange}
                      placeholder="9812345678"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Field 3: address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Detailed Address (address)
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    placeholder="Flat No. 402, Green Park Apartments, Connaught Place"
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Field 4: city */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      City Name (city)
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      placeholder="New Delhi"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  {/* Field 5: state */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      State (state)
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      placeholder="Delhi"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  {/* Field 6: pincode */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                      Postal Zip (pincode)
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      value={shippingDetails.pincode}
                      onChange={handleInputChange}
                      placeholder="110001"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* Settlement Mode Options */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Settlement Mode Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                      shippingDetails.paymentMethod === "COD"
                        ? "border-black bg-gray-50 font-bold"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={shippingDetails.paymentMethod === "COD"}
                      onChange={(e) => {
                        setShippingDetails((p) => ({
                          ...p,
                          paymentMethod: e.target.value,
                        }));
                        setError("");
                      }}
                      className="accent-black"
                    />
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wider">
                        Cash On Delivery
                      </p>
                    </div>
                  </label>

                  {/* Online Option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                      shippingDetails.paymentMethod === "ONLINE"
                        ? "border-black bg-gray-50 font-bold"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE"
                      checked={shippingDetails.paymentMethod === "ONLINE"}
                      onChange={(e) => {
                        setShippingDetails((p) => ({
                          ...p,
                          paymentMethod: e.target.value,
                        }));
                        setError("");
                      }}
                      className="accent-black"
                    />
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-wider">
                        Digital UPI / Card Gateway
                      </p>
                      <span className="text-[10px] text-green-600 block font-normal">
                        (Instant Pay via UPI/Card)
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: BILLING LEDGER */}
            <div className="lg:col-span-5 bg-[#fdfbf7] rounded-[2.5rem] border border-gray-100 p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
              <h3 className="text-base font-bold font-serif text-gray-900 tracking-wide border-b border-gray-200/60 pb-2">
                Order Billing Ledger
              </h3>

              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {cartProducts.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center text-xs"
                  >
                    <p className="font-medium text-gray-700 line-clamp-1 max-w-[200px]">
                      {item.product?.title || "Style Hub Apparel Item"}
                    </p>
                    <span className="font-bold text-gray-900">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-baseline text-sm font-bold">
                <span>Net Total Payable</span>
                <span className="text-xl font-extrabold text-black">
                  ₹{cartTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full inline-flex items-center justify-center py-4 bg-black text-[#e5c158] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-all disabled:bg-gray-400 select-none"
              >
                {submitLoading
                  ? "Processing Order..."
                  : shippingDetails.paymentMethod === "ONLINE"
                  ? "Proceed to Pay Online"
                  : "Confirm & Place Order"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SUCCESS MODAL FOR COD */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white text-gray-900 rounded-[2.5rem] p-8 text-center space-y-6 relative max-w-md w-full shadow-2xl">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
            >
              <X size={16} />
            </button>
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} className="fill-green-500 text-white" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold font-serif">
                Order Successfully Placed!
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Aapka order successfully log ho gaya hai.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Order Reference Tracker ID
              </p>
              <p className="text-sm font-extrabold text-amber-600 font-mono tracking-wide">
                {generatedOrderId}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={() => setShowSuccessModal(false)}
                className="w-full inline-flex items-center justify-center py-3 bg-black text-[#e5c158] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#1a1a1a] transition-all shadow"
              >
                Continue Luxury Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}