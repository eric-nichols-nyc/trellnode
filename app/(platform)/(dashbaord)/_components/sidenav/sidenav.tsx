"use client";

import { Logo } from "@/components/shared/logo";
import { CollapsibleNav } from "../collapsible-nav";
import { useMediaQuery } from "usehooks-ts";

export const Sidenav = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) return null;

  return (
    <CollapsibleNav>
      <div className="h-[42px] flex items-center px-2 gap-1  dark:text-red-900">
        <Logo size={20} />
        <p className="text-sm font-semibold">Trellnode workspace</p>
      </div>
      {children}
      <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0" />
    </CollapsibleNav>
  );
};
