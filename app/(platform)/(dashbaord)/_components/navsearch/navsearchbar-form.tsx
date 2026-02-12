"use client";
import { Board } from "@prisma/client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NavsearchItem } from "./navsearch-item";

type NavSearchBarFormProps = {
  boards: Board[] | null;
};
export const NavSearchBarForm = ({ boards }: NavSearchBarFormProps) => {
  const [search, setSearch] = useState("");

  const filteredResults = boards?.filter((board) => {
    if (!board) return false;
    if (!search) return false;
    return board.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="relative z-50 w-full">
      <form>
        <label htmlFor="nav-search" className="sr-only">
          Search boards
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
          <Input
            id="nav-search"
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => setTimeout(() => setSearch(""), 150)}
            className="pl-9"
          />
        </div>
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col rounded-md border bg-popover shadow-md">
          {filteredResults?.map((board) => (
            <NavsearchItem key={board.id} board={board} />
          ))}
        </ul>
      </form>
    </div>
  );
};
