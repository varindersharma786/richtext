"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export default function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Google One Tap
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        // handle sign in
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      window.location.href = "/dashboard";
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.error("Check your email for the confirmation link.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="link"
                className="cursor-pointer"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Don't have an account?</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form id="login-form" className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <div className="text-right">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto"
              onClick={() => router.push("/forgot-password")}
              type="button"
            >
              Forgot password?
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={handleEmailLogin}
          disabled={loading}
          variant={"outline"}
          className="w-full"
          form="login-form"
        >
          Sign In
        </Button>

        <Button
          onClick={handleGoogleLogin}
          variant={"default"}
          className="w-full"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
