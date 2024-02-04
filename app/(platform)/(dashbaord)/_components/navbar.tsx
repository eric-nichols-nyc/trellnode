import { Logo } from "@/components/shared/logo";
import UserMenu from "./user-menu";
import { NavSearch } from "./navsearch";

export const Navbar = () => {
  return (
    <div className="w-full h-14 px-4 border-b shadow-sm bg-white flex items-center z-100">
      <div className="flex w-full justify-between">
        <div className="flex gap-1 items-center">
          <Logo /> <span className="font-semibold">Trellnode</span>
        </div>
        <div className="flex justify-end items-center gap-2">
          <NavSearch />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};
