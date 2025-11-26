import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ShopTheLook from "@/components/home/ShopTheLook";
import ImageBanner from "@/components/home/ImageBanner";
import Newsletter from "@/components/home/Newsletter";
import ProductCarousel from "@/components/product/ProductCarousel";
import { createAdminClient } from "@/utils/supabase/admin";

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
              {bestSellers.map((product: any, index: number) => (
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

      <ImageBanner />

      <Newsletter />
    </main>
  );
}
