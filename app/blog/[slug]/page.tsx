import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CalendarIcon, UserIcon } from "lucide-react";

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
  
  // Fetch post without join first
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  // Fetch author profile separately
  let profile = null;
  if (post.author_id) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", post.author_id)
      .single();
    profile = data;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-muted">
          {post.featured_image && (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover brightness-50"
              priority
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm md:text-base drop-shadow-md">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                {profile && (
                  <div className="flex items-center gap-2">
                    {profile.avatar_url ? (
                      <Image 
                        src={profile.avatar_url} 
                        alt={profile.full_name || "Author"} 
                        width={24} 
                        height={24} 
                        className="rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    <span>{profile.full_name || "Author"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 py-12 max-w-3xl">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
