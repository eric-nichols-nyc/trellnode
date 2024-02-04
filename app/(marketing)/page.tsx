import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Home } from "./_components/home/home";

export default async function HomePage() {
  const session = await getServerSession();
  if (session && session.user) {
    redirect("/boards");
  }
  return <Home />;
}
