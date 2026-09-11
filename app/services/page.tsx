"use client";
import React, { useEffect, useState } from "react";
import { Check, ShoppingCart, HelpCircle, Sparkles } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice: number;
  pricingType: string;
  features: string[];
  isPopular: boolean;
  isFeatured: boolean;
  addToCartEnabled: boolean;
  slug: string;
}

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartUpdating, setCartUpdating] = useState<string | null>(null);

  // 1. Fetching ALL Active Services from: /api/services/all
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/services/all`,
        );
        const json = await response.json();

        // Tumhare Postman response ke hisaab se: json.success && json.data (jo ki array hai)
        if (json.success && Array.isArray(json.data)) {
          setServices(json.data);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // 2. Add to Cart Call: /api/cart/add (Click hone par hi chalega)
  const handleAddToCart = async (service: Service) => {
    setCartUpdating(service._id);

    try {
      console.log("Sending Payload to API:", {
        service: service._id,
        title: service.title,
        price: service.price,
        quantity: 1,
      });

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service._id, // Context schema mapping for backend
          title: service.title,
          price: service.price,
          quantity: 1,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${service.title} successfully added to cart!`);
      } else {
        alert(result.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart integration error:", error);
      alert(
        "Network Error: Make sure your Node.js server is running on port 5000!",
      );
    } finally {
      setCartUpdating(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* --- Section Header --- */}
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-yellow-100 shadow-sm">
            ⚡ OUR SERVICES
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tight">
            Solutions that <span className="text-[#eab308]">Power Growth</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            From integration to consulting — choose the services that fit your
            business needs. Transparent pricing, no surprises.
          </p>
        </div>

        {/* --- Skeleton Loader --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 space-y-6 animate-pulse"
              >
                <div className="h-40 bg-slate-100 rounded-3xl" />
                <div className="h-6 bg-slate-100 rounded-full w-2/3" />
                <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-100 rounded-full w-full" />
                  <div className="h-3 bg-slate-100 rounded-full w-4/5" />
                </div>
                <div className="h-12 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          /* --- Dynamic Services Grid --- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
            {services.map((service) => (
              <div
                key={service._id}
                className={`relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-2 ${
                  service.isPopular ? "ring-2 ring-yellow-500" : ""
                }`}
              >
                {/* Popular Badge */}
                {service.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-yellow-500/20 z-10">
                    <Sparkles size={10} className="fill-black" /> Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  {/* Banner/Graphic Card (Fintech Feel) */}
                  <div className="w-full h-36 bg-[#0f172a] rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
                    <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest self-end">
                      {service.pricingType}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg leading-tight tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        Ready for Sandbox & Production
                      </p>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="flex items-baseline gap-2 border-b border-slate-100 pb-5">
                    <span className="text-4xl font-black text-[#0f172a]">
                      ₹{service.price.toLocaleString("en-IN")}
                    </span>
                    {service.originalPrice > service.price && (
                      <span className="text-slate-400 text-sm line-through font-bold">
                        ₹{service.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Dynamic Features List */}
                  <ul className="space-y-3 pt-2">
                    {service.features &&
                      service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-xs font-bold text-slate-700"
                        >
                          <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-8 pt-4">
                  <button
                    onClick={() => handleAddToCart(service)}
                    disabled={
                      cartUpdating === service._id || !service.addToCartEnabled
                    }
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      !service.addToCartEnabled
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : cartUpdating === service._id
                          ? "bg-slate-100 text-slate-600"
                          : "bg-[#0f172a] text-white hover:bg-slate-800"
                    }`}
                  >
                    <ShoppingCart size={14} />
                    {cartUpdating === service._id ? "ADDING..." : "ADD TO CART"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- Custom Inquiry Banner --- */}
        <div className="mt-20 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="text-[#0f172a] font-bold text-sm">
                Have custom compliance or high-volume API requests?
              </h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Talk to our integration experts for custom pricing models.
              </p>
            </div>
          </div>
          <button className="whitespace-nowrap px-6 py-3 bg-[#0f172a] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors">
            Talk to Tech Support
          </button>
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;
