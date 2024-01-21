import { BoardDndListNav } from "./board-list-nav";
import CollapsibleNav from "./collapsible-nav";

export const Sidenav = () => {
  const isMobile = false;
  return (
    <CollapsibleNav>
        <div className="border h-[42px] flex items-center px-2">Trellnode workspace</div>
          <BoardDndListNav />
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
    </CollapsibleNav>
  );
};
