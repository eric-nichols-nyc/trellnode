"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();
  if (session && session.status === "authenticated") {
    redirect("/boards");
  }
  console.log("session", session);
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col lg:flex-row items-center lg:items-start p-40">
        <div className="flex flex-col items-center">
          <h1>Trellnode brings all your tasks, teammates, and tools together</h1>
          <button
            onClick={() => {
              signIn("google"), { callbackUrl: "/boards" };
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            sign in
          </button>
        </div>
        <div>
          <Image
            src="/images/TrelloUICollage_4x.webp"
            width={500}
            height={500}
            alt="Trello UI Collage"
          />
        </div>
      </div>
    </div>
  );
}
