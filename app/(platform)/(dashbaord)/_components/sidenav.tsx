import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronsLeft } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { BoardListNav } from "./board-list-nav";

export const Sidenav = () => {
  const isMobile = false;
  return (
    <>
      <aside className="group/sidebar h-full bg-secondary overflow-y-auto relative flex w-80 flex-col z-[99999] p-2">
        <div
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>Trellnode workspace</div>
        <div className="mt-4">
          <div>Board Items</div>
            <BoardListNav />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
      </aside>
    </>
  );
};
