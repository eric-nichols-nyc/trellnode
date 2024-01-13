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
import { BoardTitleForm } from "../../../../components/form/board-title-form";
import { FormPopover } from "@/components/form/form-popover";

type ListItemProps = {
  board: Board;
};

const ListItem = ({ board }: ListItemProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  async function handleDelete() {
    try{
        await deleteBoard(board.id);
        alert("Board deleted");
    }catch(e){
        console.log(e)
    }
  }

  return (
    <div className="group p-1">
      <Link
        href={`/boards/${board.id}`}
        className="group flex gap-2 justify-between items-center relative h-full w-full"
      >
        <div className="flex items-center gap-2">
          <div className="h-[20px] w-[32px] bg-primary rounded-sm overflow-hidden">
          <Image
            alt="placeholder image"
            src={board.imageThumbUrl}
            height={20}
            width={32}
          />
          </div>
          <BoardTitleForm title={board.title} id={board.id} />
        </div>
        <div className="invisible group-hover:visible">
        <Popover>
          <PopoverTrigger asChild>
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-[260px]" side="right">
            <PopoverClose ref={closeRef} asChild>
              <Button
                className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
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
      </Link>
    </div>
  );
};

export default ListItem;
