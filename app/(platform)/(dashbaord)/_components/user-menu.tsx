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
import { IconSize } from "@/constants";
import { RxAvatar } from "react-icons/rx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/delete-account-action";

const UserMenu = () => {
  const { data: session } = useSession();

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
          <div>
            <RxAvatar
              className="cursor-pointer"
              size={IconSize}
              color="black"
            />
          </div>
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
