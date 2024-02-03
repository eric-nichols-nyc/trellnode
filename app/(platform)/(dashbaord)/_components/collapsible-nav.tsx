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
  const [isResetting, setIsResetting] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const MOBILE_W = "260px";
  // nav is 100% width on mobile devices
  useEffect(() => {
    if (isMobile) {
      console.log(true);
    } else {
      console.log(false);
    }
  }, [isMobile]);

  function collapseSidebar() {
    setCollapsed(true);
  }

  function openSidebar() {
    setCollapsed(false);
  }

  return (
    <nav
      className={`relative ${
        collapsed ? "w-4" : "w-64"
      } h-full overflow-x-hidden min-h-full z-5 transition-all ease-out duration-500`}
    >
      <div className="absolute top-0 bottom-0 left-0 w-[260px]">
        <aside
          className={cn(
            "group/sidebar h-full overflow-y-auto relative flex w-[260px] flex-col z-[100]",
            isMobile && "w-0",
            isResetting && "transition-all ease-in-out duration-300"
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
      </div>
    </nav>
  );
};
