"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    setLoading(true);
    const { data } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("post_id", postId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (data) setComments(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("blog_comments").insert([
        {
          post_id: postId,
          user_id: user?.id || null,
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.content,
          is_approved: false, // Requires admin approval
        },
      ]);

      if (error) throw error;

      toast.success("Comment submitted! It will appear after approval.");
      setFormData({ author_name: "", author_email: "", content: "" });
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Comments List */}
      <div>
        <h3 className="text-2xl font-serif mb-8 text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>

        {loading ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                        {comment.author_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {comment.author_name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarIcon className="w-3 h-3" />
                          <span>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Comment Form */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.author_name}
                  onChange={(e) =>
                    setFormData({ ...formData, author_name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.author_email}
                  onChange={(e) =>
                    setFormData({ ...formData, author_email: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Your email will not be published
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment *</Label>
              <Textarea
                id="comment"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
                rows={5}
                placeholder="Share your thoughts..."
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Comment"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Comments are moderated and will appear after approval.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
