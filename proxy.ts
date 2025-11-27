import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // NEW — uses getAll + setAll only (future-proof)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Public pages always allowed (including login during maintenance)
  // Note: (auth) route group is invisible in URLs, so /login not /auth/login
  const publicPaths = [
    "/maintenance",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
  ];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) return response;

  // Check maintenance mode
  const { data: settings } = await supabase
    .from("store_settings")
    .select("maintenance_mode")
    .single();

  const isMaintenance = settings?.maintenance_mode === true;

  if (isMaintenance) {
    // Allow admin override
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        return response;
      }
    }

    // Non-admin → redirect to maintenance
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
