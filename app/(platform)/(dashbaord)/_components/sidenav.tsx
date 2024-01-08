import { BoardListNav } from "./board-list-nav";
import CollapsibleNav from "./collapsible-nav";

export const Sidenav = () => {
  const isMobile = false;
  return (
    <CollapsibleNav>
        <div>Trellnode workspace</div>
        <div className="mt-4">
            <BoardListNav />
        </div>
        <div className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" />
    </CollapsibleNav>
  );
};
