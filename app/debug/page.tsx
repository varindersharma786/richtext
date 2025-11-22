import { createClient } from "@/utils/supabase/server";

export const revalidate = 0;

export default async function DebugPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Posts</h1>
      {error && (
        <div className="bg-red-100 p-4 mb-4 text-red-800">
          Error: {error.message}
        </div>
      )}
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(posts, null, 2)}
      </pre>
    </div>
  );
}
