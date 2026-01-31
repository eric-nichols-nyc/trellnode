import { Board } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type NavSearchBarFormProps = {
  board: Board;
};
export const NavsearchItem = ({ board }: NavSearchBarFormProps) => {
  return (
    <HoverCard>
    <Link href={`/boards/${board.id}`} className="cursor-pointer flex gap-1 bg-slate-200 w-full">
     {board.imageThumbUrl ? (
      <Image src={board.imageThumbUrl} alt="board" width={32} height={32} />
    ) : (
      <div className="w-8 h-8 bg-muted rounded shrink-0" aria-hidden />
    )}
  
      <HoverCardTrigger asChild>
        <Button variant="link">{board.title}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    
    </Link>
    </HoverCard>
  );
};
