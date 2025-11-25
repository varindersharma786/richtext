// app/page.tsx
import Hero from "@/components/store/Hero";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import CategoriesShowcase from "@/components/store/CategoriesShowcase";
import Testimonials from "@/components/store/Testimonials";
import Newsletter from "@/components/store/Newsletter";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
    <Navbar/>
      <Hero />
      <CategoriesShowcase />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  );
}