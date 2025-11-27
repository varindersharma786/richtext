import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for session management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // Get current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Paths that should ALWAYS be accessible (even during maintenance)
  const publicPaths = [
    "/maintenance",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
    "/(auth)",
  ];

  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Always allow access to public paths first
  if (isPublicPath) {
    return response;
  }

  // Check maintenance mode from store_settings
  const { data: settings } = await supabase
    .from("store_settings")
    .select("maintenance_mode")
    .single();

  const isMaintenanceMode = settings?.maintenance_mode || false;

  // If maintenance mode is active
  if (isMaintenanceMode) {
    // Check if user is admin
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      // Allow admin to bypass maintenance mode
      if (profile?.role === "admin") {
        return response;
      }
    }

    // Redirect non-admin users to maintenance page
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
