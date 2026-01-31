"use client";
import { signOut, useSession } from "next-auth/react";
import { Github, LogOut } from "lucide-react";
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

const UserMenu = () => {
  const { data: session } = useSession();

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
          <DropdownMenuItem>
            <Button
              onClick={() => {
                signOut(), { callbackUrl: "/" };
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
