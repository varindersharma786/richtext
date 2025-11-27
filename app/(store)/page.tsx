import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ShopTheLook from "@/components/home/ShopTheLook";
import ImageBanner from "@/components/home/ImageBanner";
import Newsletter from "@/components/home/Newsletter";
import ProductCarousel from "@/components/product/ProductCarousel";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  Star,
  Truck,
  Shield,
  RefreshCcw,
  Headphones,
  Instagram,
} from "lucide-react";

const supabase = createAdminClient();

async function getCategories() {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(3);

  return data || [];
}

async function getFeaturedProducts() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return data || [];
}

async function getBestSellers() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return data || [];
}

export default async function HomePage() {
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts();
  const bestSellers = await getBestSellers();

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content:
        "The quality is exceptional! Every piece I've ordered has exceeded my expectations. The attention to detail is remarkable.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Loyal Customer",
      content:
        "Fast shipping, beautiful packaging, and products that last. This is now my go-to store for premium fashion.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Style Blogger",
      content:
        "I love the timeless designs and sustainable approach. These pieces truly elevate my wardrobe.",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over ₹2,000",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer service",
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      <Hero />
      <Marquee />

      {/* Best Sellers Grid */}
      {bestSellers.length > 0 && (
        <section className="py-24 bg-white dark:bg-neutral-950">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 dark:text-white">
                Best Sellers
              </h2>
              <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {bestSellers.map((product: any) => (
                <div key={product.id} className="group">
                  <a href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[3/4] bg-gray-100 dark:bg-neutral-800 overflow-hidden mb-4">
                      <img
                        src={product.image_url || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-sm font-light text-gray-900 dark:text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturedCategories categories={categories} />

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm">
                  <feature.icon className="w-7 h-7 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShopTheLook />

      {/* New Arrivals Product Carousel */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-white dark:bg-neutral-950 border-t border-gray-100 dark:border-neutral-900">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 dark:text-white">
                New Arrivals
              </h2>
              <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
            </div>

            <ProductCarousel products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900 dark:text-white">
              What Our Customers Say
            </h2>
            <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-24 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Instagram className="w-6 h-6 text-gray-900 dark:text-white" />
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 dark:text-white">
                Follow Us @richtext
              </h2>
            </div>
            <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Join our community and get inspired
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <a
                key={index}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600">
                  <Instagram className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <ImageBanner />

      <Newsletter />
    </main>
  );
}
