import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen font-display bg-gradient-to-b from-amber-50/80 via-stone-50 to-white flex flex-col">
      <header className="h-14 px-4 border-b shadow-sm bg-white flex items-center">
        <Logo />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-2">
          <p className="text-8xl font-semibold text-stone-300">404</p>
          <h1 className="text-xl text-stone-700">Page not found</h1>
          <p className="text-stone-500 max-w-sm">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </main>
    </div>
  );
}
