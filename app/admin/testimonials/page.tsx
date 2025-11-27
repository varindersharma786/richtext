import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

export default async function TestimonialsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return redirect("/");
  }

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true });

  async function deleteTestimonial(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const supabase = await createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    redirect("/admin/testimonials");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
          <p className="text-muted-foreground">Manage customer testimonials</p>
        </div>
        <Button asChild>
          <Link href="/admin/testimonials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {testimonial.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/testimonials/${testimonial.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form action={deleteTestimonial}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <Button
                      variant="outline"
                      size="sm"
                      type="submit"
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {testimonial.role}
                </p>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm">{testimonial.content}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      testimonial.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {testimonial.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Order: {testimonial.display_order}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-muted-foreground mb-4">No testimonials yet</p>
              <Button asChild>
                <Link href="/admin/testimonials/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Testimonial
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
