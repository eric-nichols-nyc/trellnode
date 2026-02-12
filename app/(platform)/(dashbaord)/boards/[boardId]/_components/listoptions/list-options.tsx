"use client"

import { ElementRef, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontalIcon, Trash, TrashIcon, X } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { deleteList } from "@/actions/delete-list-action";
import { redirect } from "next/navigation";

type ListOptionProps = {
  listId: string;
  boardId: string;
};

export const ListOptions = ({ listId, boardId }: ListOptionProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  async function onDelete() {
    const result = await deleteList({ id:listId, boardId });
    // redirect to boards page if successful
    // if (result.success) {
    //   redirect("/boards");
    // }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreHorizontalIcon className="absolute right-2 top-2 text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="bg-white border rounded-md shadow-md w-32">
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Separator />
        <div className="p-2 hover:bg-gray-100 cursor-pointer">
         
            <Button size="sm" onClick={onDelete}><TrashIcon className="h-4 w-4" /></Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
