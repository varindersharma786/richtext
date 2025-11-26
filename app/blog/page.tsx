import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
     
      
      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group">
                  <Card className="h-full overflow-hidden border-border hover:border-primary transition-colors flex flex-col">
                    <div className="relative w-full h-48 bg-muted">
                      {post.featured_image ? (
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {post.meta_description || "Read more about this topic..."}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Badge variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        Read Article
                      </Badge>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No posts found yet.</p>
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}
