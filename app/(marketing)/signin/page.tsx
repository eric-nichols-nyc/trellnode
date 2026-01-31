import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Signin } from "@/components/shared/signin/signin";
import { options } from "@/app/api/auth/[...nextauth]/options";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(options);
  if (session?.user) {
    redirect("/boards");
  }
  const { error } = await searchParams;
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center pt-14">
      <div className="w-full max-w-xs rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-center text-lg font-semibold">Sign in</h1>
        <Signin errorFromUrl={error} />
      </div>
    </div>
  );
}
