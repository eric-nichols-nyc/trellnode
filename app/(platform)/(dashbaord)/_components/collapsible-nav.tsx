"use client";
"use client";
import { ChevronsLeft, MenuIcon } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CollapsibleProps = {
  children: React.ReactNode;
};
export const CollapsibleNav = ({ children }: CollapsibleProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = false;
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  function collapseSidebar() {
    if (!sidebarRef.current) return;
    setIsCollapsed(true);
    sidebarRef.current.style.width = "0";
  }

  function openSidebar() {
    if (!sidebarRef.current) return;
    setIsCollapsed(false);
    sidebarRef.current.style.width = "260px";
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-[260px] flex-col z-[99999]",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={() => collapseSidebar()}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>{children}</div>
      </aside>
    {isCollapsed && <MenuIcon onClick={openSidebar} role="button" className="h-6 w-6 text-muted-foreground" />}
    </>
  );
};

export default CollapsibleNav;
