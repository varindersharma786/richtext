"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, Clock, ArrowRight, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  meta_description: string | null;
  created_at: string;
  categories?: { id: string; name: string; slug: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  async function fetchCategories() {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .eq("is_active", true)
      .order("name");
    if (data) setCategories(data);
  }

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        post_categories (
          blog_categories (
            id,
            name,
            slug
          )
        )
      `
      )
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
      );
    }

    const { data } = await query;

    if (data) {
      // Transform data to include categories
      const transformedPosts = data.map((post: any) => ({
        ...post,
        categories:
          post.post_categories
            ?.map((pc: any) => pc.blog_categories)
            .filter(Boolean) || [],
      }));

      // Filter by category if selected
      let filteredPosts = transformedPosts;
      if (selectedCategory) {
        filteredPosts = transformedPosts.filter((post: any) =>
          post.categories.some((cat: any) => cat.slug === selectedCategory)
        );
      }

      setPosts(filteredPosts);
    }
    setLoading(false);
  }

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gray-100 dark:bg-neutral-900">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50 dark:to-neutral-950/50" />
        <div className="container mx-auto px-4 max-w-[1400px] text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-gray-900 dark:text-white">
            Journal
          </h1>
          <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto mb-6" />
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Stories, inspiration, and insights from our world
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.slug ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 max-w-[1400px]">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block mb-20 group"
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      {featuredPost.featured_image ? (
                        <Image
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                          Featured Image
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                          Featured
                        </span>
                        {featuredPost.categories &&
                          featuredPost.categories.length > 0 && (
                            <span className="text-xs uppercase tracking-wider text-primary font-medium">
                              • {featuredPost.categories[0].name}
                            </span>
                          )}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed line-clamp-3">
                        {featuredPost.meta_description ||
                          "Read more about this topic..."}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {new Date(
                              featuredPost.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>5 min read</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-gray-900 dark:text-white font-medium group-hover:gap-4 transition-all">
                          Read Article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Regular Posts Grid */}
              {regularPosts && regularPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {regularPosts.map((post) => (
                    <Link
                      href={`/blog/${post.slug}`}
                      key={post.id}
                      className="group"
                    >
                      <article className="space-y-4">
                        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                          {post.featured_image ? (
                            <Image
                              src={post.featured_image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            {post.categories && post.categories.length > 0 && (
                              <span className="text-primary">
                                {post.categories[0].name}
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-serif text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 text-sm">
                            {post.meta_description ||
                              "Read more about this topic..."}
                          </p>
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium group-hover:gap-3 transition-all">
                              Read More
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
                {searchQuery || selectedCategory
                  ? "No posts found matching your criteria"
                  : "No posts published yet"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-gray-50 dark:bg-neutral-900/50">
        <div className="container mx-auto px-4 max-w-[800px] text-center">
          <h2 className="text-4xl font-serif mb-4 text-gray-900 dark:text-white">
            Stay Updated
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter for the latest stories and updates
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
            />
            <button
              type="submit"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
