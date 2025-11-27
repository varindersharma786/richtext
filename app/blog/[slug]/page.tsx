import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CalendarIcon, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import ShareButtons from "@/components/blog/ShareButtons";
import CommentSection from "@/components/blog/CommentSection";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, meta_title, meta_description, featured_image")
    .eq("slug", slug)
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: {
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch post
  const { data: post } = await supabase
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
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch author profile
  let profile = null;
  if (post.author_id) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", post.author_id)
      .single();
    profile = data;
  }

  // Fetch related posts
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .neq("slug", slug)
    .limit(3)
    .order("created_at", { ascending: false });

  // Extract categories
  const categories =
    post.post_categories
      ?.map((pc: any) => pc.blog_categories)
      .filter(Boolean) || [];

  // Get current URL for sharing
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://yoursite.com/blog/${slug}`;

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Hero Image */}
      <div className="relative w-full h-[60vh] bg-gray-100 dark:bg-neutral-900">
        {post.featured_image && (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Article Header */}
      <div className="container mx-auto px-4 max-w-[800px] -mt-32 relative z-10">
        <article className="bg-white dark:bg-neutral-950 p-8 md:p-12 shadow-xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </Link>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 mb-4">
              {categories.map((category: any) => (
                <span
                  key={category.id}
                  className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 pb-8 mb-8 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name || "Author"}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                    {profile?.full_name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {profile?.full_name || "Author"}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>5 min read</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <ShareButtons title={post.title} url={currentUrl} />
            </div>
          </div>

          {/* Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-gray-900 dark:prose-a:text-white prose-a:underline prose-a:decoration-2
            hover:prose-a:text-gray-600 dark:hover:prose-a:text-gray-400
            prose-img:rounded-lg prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-gray-900 dark:prose-blockquote:border-white
            prose-blockquote:italic prose-blockquote:font-serif"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />

          {/* Comments Section */}
          <div className="mt-16 pt-16 border-t border-gray-200 dark:border-neutral-800">
            <CommentSection postId={post.id} />
          </div>
        </article>
      </div>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-24 bg-gray-50 dark:bg-neutral-900/50 mt-24">
          <div className="container mx-auto px-4 max-w-[1400px]">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif mb-4 text-gray-900 dark:text-white">
                Related Stories
              </h2>
              <div className="w-20 h-0.5 bg-gray-900 dark:bg-white mx-auto" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  key={relatedPost.id}
                  className="group"
                >
                  <article className="space-y-4">
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
                      {relatedPost.featured_image ? (
                        <Image
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
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
                            {new Date(
                              relatedPost.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-serif text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <span className="inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white font-medium group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
