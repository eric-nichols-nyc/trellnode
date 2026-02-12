import { Logo } from "@/components/shared/logo";
import UserMenu from "./user-menu";
import { NavSearch } from "./navsearch/navsearch";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

export const Navbar = () => {
  return (
    <div className="w-full h-14 px-4 border-b shadow-sm bg-white flex items-center z-100">
      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex gap-1 items-center shrink-0">
          <Logo /> <Link href="/"><span className="font-semibold">Trellnode</span></Link>
        </div>
        <div className="flex-1 min-w-0 flex">
          <NavSearch />
        </div>
        <div className="flex justify-end items-center gap-2 shrink-0">
          <Button
            variant="default"
            size="sm"
            style={{
              backgroundColor: "#FF7300", // dark orange
              color: "white",
              borderColor: "#d25d00"
            }}
            className="hover:bg-orange-700 focus:ring-orange-800"
          >
              Create
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
