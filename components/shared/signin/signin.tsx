"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { signUp } from "@/actions/signup-action";
import { toast } from "sonner";

const CALLBACK_URL = "/boards";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = signInSchema.extend({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FieldErrors = { email?: string; password?: string; name?: string };

const AUTH_ERROR_MESSAGE = "Invalid email or password.";

export const Signin = ({ errorFromUrl }: { errorFromUrl?: string }) => {
  const [authError, setAuthError] = useState<string | null>(null);
  useEffect(() => {
    if (errorFromUrl) {
      setAuthError(AUTH_ERROR_MESSAGE);
      toast.error(AUTH_ERROR_MESSAGE);
    }
  }, [errorFromUrl]);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setAuthError(null);

    const schema = isSignUp ? signUpSchema : signInSchema;
    const parsed = schema.safeParse(
      isSignUp ? { email, password, name } : { email, password }
    );

    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const path = err.path[0] as keyof FieldErrors;
        if (path && !errors[path]) errors[path] = err.message;
      });
      setFieldErrors(errors);
      toast.error("Please fix the errors below.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const result = await signUp(email, password, name);
        if (result.error) {
          setAuthError(result.error);
          toast.error(result.error);
          return;
        }
        // Sign in with same credentials so user lands on /boards without re-entering password
        await signIn("credentials", {
          email: parsed.data.email.trim().toLowerCase(),
          password: parsed.data.password,
          callbackUrl: `${window.location.origin}${CALLBACK_URL}`,
          redirect: true,
        });
        // If redirect: true didn’t navigate (e.g. error), show sign-in form
        toast.success("Account created. Sign in below.");
        setPassword("");
        setIsSignUp(false);
      } else {
        const result = await signIn("credentials", {
          email: parsed.data.email,
          password: parsed.data.password,
          callbackUrl: `${window.location.origin}${CALLBACK_URL}`,
          redirect: false,
        });
        if (result?.error || result?.status === 401 || !result?.ok) {
          setAuthError(AUTH_ERROR_MESSAGE);
          toast.error(AUTH_ERROR_MESSAGE);
          return;
        }
        if (result?.url) window.location.href = result.url;
      }
    } catch (err) {
      console.error(err);
      const message =
        (err && typeof err === "object" && "status" in err && (err as { status?: number }).status === 401) ||
        (err && typeof err === "object" && "message" in err && String((err as { message?: string }).message).toLowerCase().includes("401"))
          ? AUTH_ERROR_MESSAGE
          : "Something went wrong. Please try again.";
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <h1 className="mb-4 text-center text-lg font-semibold">
        {isSignUp ? "Sign up" : "Sign in"}
      </h1>
      <form data-testid="signin-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
        {isSignUp && (
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
            />
            {fieldErrors.name && (
              <p id="name-error" className="text-sm text-destructive">
                {fieldErrors.name}
              </p>
            )}
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isSignUp ? 8 : undefined}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          {fieldErrors.password && (
            <p id="password-error" className="text-sm text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>
        {authError && (
          <p role="alert" className="text-sm text-destructive rounded-md bg-destructive/10 p-2">
            {authError}
          </p>
        )}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => {
          setIsSignUp(!isSignUp);
          setFieldErrors({});
          setAuthError(null);
        }}
        className="text-sm text-muted-foreground hover:underline"
      >
        {isSignUp ? "Already have an account? Sign in" : "Create an account"}
      </button>
      <div className="relative">
        <span className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </span>
        <span className="relative flex justify-center text-xs uppercase text-muted-foreground">
          Or
        </span>
      </div>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: CALLBACK_URL })}
        className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center gap-2 dark:focus:ring-[#4285F4]/55"
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          />
        </svg>
        {isSignUp ? "Sign up with Google" : "Sign in with Google"}
      </button>
    </div>
  );
};
