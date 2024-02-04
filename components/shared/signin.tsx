"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export const Signin = () => {
  return (
    <Button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => {
        signIn("google"), { callbackUrl: "/boards" };
      }}
    >
      Sign in
    </Button>
  );
};
