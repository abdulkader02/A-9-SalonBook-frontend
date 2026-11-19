"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { getSafeCallbackUrl } from "@/lib/utils";
import { ArrowLeft, Scissors } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SignInForm = ({ callbackUrl }: { callbackUrl?: string }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Only internal paths are accepted; otherwise keep the default redirect.
  const redirectTo = getSafeCallbackUrl(callbackUrl) ?? "/";
  const signUpHref =
    redirectTo === "/"
      ? "/sign-up"
      : `/sign-up?callbackUrl=${encodeURIComponent(redirectTo)}`;

  // Return to the previous page; fall back to the homepage when there is no
  // history to go back to (e.g. the page was opened directly).
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    setSubmitting(true);
    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        toast.error(
          result.error.message ?? "Invalid email or password. Please try again."
        );
        return;
      }
      toast.success("Signed in successfully!");
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  
const handleGoogleSignIn = async () => {
  try {
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: redirectTo,
    });

    if (error) {
      toast.error("Google sign-in failed. Please try again.");
      console.error("Google sign-in error:", error);
    }
  } catch (error) {
    console.error("Unexpected Google sign-in error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-3 flex w-full max-w-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <span className="mb-1 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Scissors className="size-5" />
          </span>
          <CardTitle className="text-xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to manage your salon appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="my-4 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={signUpHref}
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInForm;