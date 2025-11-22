import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SignatureBuilder from "@/components/signature/signature-builder";

export default async function SignaturePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Email Signature Builder</h1>
        <p className="text-muted-foreground">
          Drag and drop elements to create your custom signature.
        </p>
      </div>
      <SignatureBuilder />
    </div>
  );
}
