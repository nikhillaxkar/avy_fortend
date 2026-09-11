import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import WhyChooseUs from "@/components/WhyChooseUs";
import Steps from "@/components/Steps";
import FAQ from "@/components/FAQ";
import ProductGrid from "@/components/ProductGrid";
import PromoBanners from "@/components/PromoBanners";
import FeaturedSection from "@/components/FeaturedSection";
import ProductReviews from "@/components/ProductReviews";

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <Features />
      <ProductGrid />
      <PromoBanners/>
      <FeaturedSection/>
      <ProductReviews/>
      {/* <WhyChooseUs /> */}
      {/* <Steps />
      <Pricing />
      <FAQ /> */}
      {/* Yahan Footer add kar sakte ho */}
    </main>
  );
}
