import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center">
      <div className="flex w-full justify-between items-center">
        <Logo />
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}