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
        <Signin errorFromUrl={error} />
      </div>
    </div>
  );
}
