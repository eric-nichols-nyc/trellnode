'use client';
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const session = useSession();
  if(session && session.status === 'authenticated') {
    redirect('/boards')
  }
  console.log('session', session)
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col items-center p-40">
        <h1>Do more with Trellnode</h1>
        <button
          onClick={() => {
            signIn('google'),
            { callbackUrl: '/boards' }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          sign in
        </button>
      </div>
    </div>
  );
}
