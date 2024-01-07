import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Github, LogOut, Palette, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconSize } from "@/constants";
import { RxAvatar } from "react-icons/rx";

const UserMenu = () => {
  return (
    <div className="w-full flex justify-end">
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
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
          <LogOut 
            className="mr-2 h-4 w-4"    
            onClick={() => {
                signOut(), { callbackUrl: "/" };
              }} />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
