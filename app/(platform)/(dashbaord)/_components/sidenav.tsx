import { Logo } from "@/components/shared/logo";
import { BoardListNav } from "./board-list-nav";
import {CollapsibleNav} from "./collapsible-nav";

export const Sidenav = () => {
  return (
      <CollapsibleNav>
        <div className="h-[42px] flex items-center px-2 gap-1">
          <Logo size={20}  />
          <p className="text-sm font-semibold">Trellnode workspace</p>
        </div>
        <BoardListNav />
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 right-0 top-0" />
      </CollapsibleNav>
  );
};
