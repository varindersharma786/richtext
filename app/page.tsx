import { createClient } from "@/utils/supabase/server";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductCarousel from "@/components/product/ProductCarousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Star } from "lucide-react";
import Link from "next/link";

export default async function EcommerceHomepage() {
  const supabase = await createClient();

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .limit(8)
    .order("created_at", { ascending: false });

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "On all orders over ₹5000",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Hand-picked materials",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-taupe-100 text-taupe-900 rounded-full flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <ProductCarousel products={featuredProducts || []} title="New Arrivals" />

      {/* Category Banner */}
      <section className="py-20 bg-taupe-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Abstract pattern or image could go here */}
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Elevate Your Style
          </h2>
          <p className="text-xl text-taupe-100 mb-10 max-w-2xl mx-auto">
            Discover our curated collection of premium essentials designed for
            the modern lifestyle.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="bg-white text-taupe-900 hover:bg-taupe-100 px-8 py-6 text-lg rounded-full"
            >
              Shop Collection <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Best Sellers (Reusing ProductCarousel for now, ideally different query) */}
      <ProductCarousel products={featuredProducts || []} title="Best Sellers" />

      {/* Newsletter */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Community
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to receive updates, access to exclusive deals, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-taupe-200"
            />
            <Button
              size="lg"
              className="bg-taupe-900 hover:bg-taupe-800 text-white px-8 py-4 rounded-full h-auto"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
