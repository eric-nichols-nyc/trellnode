"use client";
import { ElementRef, useRef } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverClose,
  } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { CreateBoardForm } from "./create-board-form";

  type FormPopoverProps = {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
  };

  export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0,
  }: FormPopoverProps) => {  
    const closeRef = useRef<ElementRef<"button">>(null);

    function onClose(){
      closeRef.current?.click();
    }

    return (
    <Popover>
     <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" side="left">
      <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        {/* create board from sidenav */}
        <CreateBoardForm close={onClose}/>
      </PopoverContent>
    </Popover>
  )
}