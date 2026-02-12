"use client";
import { signOut, useSession } from "next-auth/react";
import { Github, LogOut, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/delete-account-action";

function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

const UserMenu = () => {
  const { data: session } = useSession();
  const initials = getInitials(session?.user?.name ?? undefined);

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure? This will permanently delete your account and all your boards, lists, and cards."
      )
    ) {
      return;
    }
    const { error } = await deleteAccount();
    if (error) {
      alert(error);
      return;
    }
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="User menu"
          >
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={session?.user?.image ?? undefined} alt="" />
              <AvatarFallback className="bg-stone-200 text-stone-700 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {session?.user?.name && (
            <>
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{session.user.name}</p>
                {session.user.email && (
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <Link
              href="https://github.com/eric-nichols-nyc/trellnode"
              target="_blank"
            >
              <span>GitHub</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start font-normal"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              type="button"
              className="flex w-full items-center px-2 py-1.5 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete account</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
