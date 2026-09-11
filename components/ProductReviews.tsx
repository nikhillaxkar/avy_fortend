"use client";

import { useState, useEffect } from "react";
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
} from "lucide-react";

// Real & Relatable Customer Reviews
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Neha Gupta",
    city: "Jaipur",
    role: "Verified Buyer",
    itemBought: "Cotton Printed Kurti Set",
    rating: 5,
    comment:
      "The printed kurti set I ordered was exactly as shown in the pictures! Pure cotton fabric, zero shrinkage after wash, and the color is super vibrant. Truly premium quality.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    city: "Delhi",
    role: "Verified Buyer",
    itemBought: "Anarkali Suit with Dupatta",
    rating: 5,
    comment:
      "I absolutely loved the flare of the Anarkali suit. The Gota Patti work on the neckline looks so luxurious. Wore it to a wedding function and received endless compliments!",
  },
  {
    id: 3,
    name: "Ritu Agarwal",
    city: "Ahmedabad",
    role: "Verified Buyer",
    itemBought: "A-Line Long Floral Kurti",
    rating: 5,
    comment:
      "Very elegant design and super comfortable for all-day office wear. Fabric is lightweight yet high quality. Customer team was also fast in helping with size selection.",
  },
  {
    id: 4,
    name: "Pooja Singh",
    city: "Lucknow",
    role: "Verified Buyer",
    itemBought: "Chikankari Style Kurti Set",
    rating: 5,
    comment:
      "The embroidery detail is incredibly fine and clean. Fitting was spot on according to the size chart. Packing was premium too. Definitely ordering again from AVY!",
  },
  {
    id: 5,
    name: "Ananya Roy",
    city: "Kolkata",
    role: "Verified Buyer",
    itemBought: "Bandhani Print Kurta Set",
    rating: 5,
    comment:
      "Fast delivery within 3 days! The fabric feels breathable and ultra-soft on skin. The dupatta pattern complements the kurta perfectly.",
  },
];

// 🎨 AVY Fashion Palette
const AVY = {
  ink: "#5c2430", // Deep Burgundy
  inkDark: "#3d1720", // Dark Burgundy
  accent: "#b5715f", // Rose Gold Accent
  accentSoft: "#e9c9b8", // Light Rose Border
  white: "#fffaf8", // Warm White
  cardBg: "#fdf2ee", // Soft Blush Card Background
};

export default function ProductReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto Slider Effect (3.8 seconds)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3800);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % REVIEWS_DATA.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? REVIEWS_DATA.length - 1 : prevIndex - 1,
    );
  };

  return (
    <section className="bg-[#fffaf8] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e9c9b8] bg-[#fdf2ee]">
            <Sparkles size={13} style={{ color: AVY.accent }} />
            <span
              className="text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: AVY.ink }}
            >
              REAL CLIENT STORIES
            </span>
          </div>

          <h2
            className="text-3xl sm:text-5xl font-serif font-bold tracking-tight"
            style={{ color: AVY.ink }}
          >
            Loved By Women
          </h2>
          <p className="text-xs sm:text-sm text-[#8c6b63] font-normal leading-relaxed">
            Over{" "}
            <span className="font-bold text-[#5c2430]">
              50,000+ happy shoppers
            </span>{" "}
            trust our ethnic collections. Here is what they have to say.
          </p>
        </div>

        {/* --- REVIEWS SLIDER CAROUSEL --- */}
        <div
          className="relative px-2 sm:px-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Controls - Left / Right Floating Buttons */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-[#e9c9b8] shadow-lg items-center justify-center text-[#5c2430] hover:bg-[#5c2430] hover:text-[#fffaf8] hover:border-[#5c2430] transition-all duration-300 active:scale-95"
            aria-label="Previous Review"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border border-[#e9c9b8] shadow-lg items-center justify-center text-[#5c2430] hover:bg-[#5c2430] hover:text-[#fffaf8] hover:border-[#5c2430] transition-all duration-300 active:scale-95"
            aria-label="Next Review"
          >
            <ChevronRight size={20} />
          </button>

          {/* Cards Grid Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((offset) => {
              const reviewIndex = (currentIndex + offset) % REVIEWS_DATA.length;
              const review = REVIEWS_DATA[reviewIndex];

              return (
                <div
                  key={review.id}
                  className={`relative rounded-[2rem] p-7 sm:p-9 border border-[#efdcd2] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group bg-white/90 ${
                    offset >= 1 ? "hidden md:flex" : ""
                  } ${offset === 2 ? "hidden lg:flex" : ""}`}
                >
                  {/* Decorative Subtle Quote Mark */}
                  <Quote
                    size={48}
                    className="absolute right-6 top-6 text-[#f3e1d8] group-hover:text-[#e9c9b8] transition-colors pointer-events-none"
                  />

                  <div className="space-y-5 z-10">
                    {/* Rating & Product Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={AVY.accent}
                            style={{ color: AVY.accent }}
                          />
                        ))}
                      </div>

                      <span
                        className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: AVY.cardBg,
                          borderColor: AVY.accentSoft,
                          color: AVY.ink,
                        }}
                      >
                        {review.itemBought}
                      </span>
                    </div>

                    {/* Review Body */}
                    <p className="text-xs sm:text-sm leading-relaxed font-serif text-[#4a3632] italic">
                      “{review.comment}”
                    </p>
                  </div>

                  {/* Customer Footer */}
                  <div className="flex items-center gap-4 pt-6 mt-6 border-t border-[#efdcd2]/60 z-10">
                    <div
                      className="w-11 h-11 rounded-full font-serif font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{
                        backgroundColor: AVY.inkDark,
                        color: AVY.accentSoft,
                      }}
                    >
                      {review.name.charAt(0)}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h4
                          className="font-bold text-sm tracking-wide"
                          style={{ color: AVY.ink }}
                        >
                          {review.name}
                        </h4>
                        <CheckCircle2
                          size={14}
                          className="text-emerald-600 fill-emerald-100"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-[#8c6b63]">
                        {review.city} •{" "}
                        <span className="text-emerald-700 font-semibold">
                          {review.role}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator Navigation */}
          <div className="flex justify-center items-center gap-2 mt-10">
            {REVIEWS_DATA.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-8 bg-[#5c2430]"
                    : "w-2 bg-[#e9c9b8] hover:bg-[#b5715f]"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
