"use client";

import { Board } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ElementRef, useRef } from "react";
import { deleteBoard } from "@/actions/delete-board-action";
import { toast } from "sonner";
type BoardDndListItemProps = {
  board: Board;
};

export const BoardDndListItem = ({ board }: BoardDndListItemProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  async function handleDelete() {
    try{
        await deleteBoard(board.id);
        toast.success('Board deleted successfully');
    }catch(e){
      console.error('there was an error deleting the board', e);  
      toast.error('There was an error deleting the board. Please try again.');
    }
  }


  return (
    <div className="group relative">
      <Link
        href={`/boards/${board.id}`}
        className="group flex 
          py-2 justify-between items-center 
          relative h-full w-full hover:bg-slate-200/50"
      >
        <div className="flex items-center gap-2 px-2">
          <div className="h-[20px] w-[32px] bg-primary rounded-sm overflow-hidden">
          <Image
            alt="placeholder image"
            src={board.imageThumbUrl}
            height={20}
            width={32}
          />
          </div>
          <div>
            <h2 className="text-sm">{board.title}</h2>
          </div>
        </div>
      </Link>
      <div className="hidden px-2 absolute right-4 top-3 z-10">
        <Popover>
          <PopoverTrigger asChild> 
            <MoreHorizontal size={16} className="cursor-pointer hover:bg-slate-100"/>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-[260px]" side="right">
            <PopoverClose ref={closeRef} asChild>
              <Button
                className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 cursor-pointer"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </PopoverClose>
            <div>{board.title}</div>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </PopoverContent>
        </Popover>
        </div>
    </div>
  );
};
