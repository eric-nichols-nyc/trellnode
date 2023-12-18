'use client';
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  // const session = useSession();
  return (
    <div>
      <button
        onClick={() => {
          signIn('google');
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        sign in
      </button>
    </div>
  );
}
