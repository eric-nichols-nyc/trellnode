"use client";
import { ChevronsLeft, MenuIcon } from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";

type CollapsibleProps = {
  children: React.ReactNode;
};
export const CollapsibleNav = ({ children }: CollapsibleProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isResetting, setIsResetting] = useState(false)
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const MOBILE_W = '260px'
  // nav is 100% width on mobile devices
  useEffect(() => {
    if(isMobile){
      console.log(true)
    }else{
      console.log(false)
    }
  },[isMobile])

  function collapseSidebar() {
    if (!sidebarRef.current) return;
    setIsCollapsed(true);
    sidebarRef.current.style.width = "0";
  }

  function openSidebar() {
    console.log('openSidebar', isMobile)
    if (!sidebarRef.current) return;
    setIsCollapsed(false);
    // if isMobile open to full width
    sidebarRef.current.style.width = isMobile ? "100vw" : MOBILE_W;
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-[260px] flex-col z-[100]",
          isMobile && "w-0",
          isResetting && "transition-all ease-in-out duration-300",
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
      {isCollapsed && (
        <MenuIcon
          onClick={openSidebar}
          role="button"
          className="h-6 w-6 text-muted-foreground"
        />
      )}
    </>
  );
};

export default CollapsibleNav;
