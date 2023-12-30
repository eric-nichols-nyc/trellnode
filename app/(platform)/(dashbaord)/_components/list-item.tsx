import { Board } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type ListItemProps = {
  board: Board;
};

const ListItem = ({ board }: ListItemProps) => {
  return (
    <div>
      <Link
        href="#"
        className="group flex gap-2 justify-between relative h-full w-full border"
      >
        <div className="flex gap-2">
          <Image
            alt="placeholder image"
            src={board.imageThumbUrl}
            height={20}
            width={20}
          />
          <span>{board.title}</span>
        </div>
        <Popover >
          <PopoverTrigger asChild>
            <MoreHorizontal />
          </PopoverTrigger>
          <PopoverContent className="flex flex-col w-[300px]" side="right">
            <span>{board.title}</span>
            <Button size="sm" variant="destructive">Delete</Button>
          </PopoverContent>
        </Popover>
      </Link>
    </div>
  );
};

export default ListItem;
