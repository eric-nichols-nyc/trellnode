"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { signUp } from "@/actions/signup-action";
import { toast } from "sonner";

const CALLBACK_URL = "/boards";

export const Signin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const result = await signUp(email, password, name);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success("Account created. Sign in below.");
        setPassword("");
        setIsSignUp(false);
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          callbackUrl: CALLBACK_URL,
          redirect: false,
        });
        if (result?.error) {
          toast.error("Invalid email or password.");
          return;
        }
        if (result?.url) window.location.href = result.url;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            />
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
          />
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
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
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
        Sign in with Google
      </button>
    </div>
  );
};
