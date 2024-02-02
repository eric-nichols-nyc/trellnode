"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { createBoard } from "@/actions/create-board-action";
import { ElementRef, useRef, useState } from "react";
import { UserRound, X } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";

type BoardListProps = {
  boards: any;
};

export const AllBoardsList = ({ boards }: BoardListProps) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleAddBoard(e: any) {
    e.preventDefault();
    console.log(e.currentTarget);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    // call to server action
    const obj = { title, image };
    const result = (await createBoard(obj)) as any;
    if (result.id) {
      // router.push(`/boards/${result.id}`)
    } else if (result.errors) {
      setFieldErrors(result.errors);
    }
  }
  return (
    <div className="boards-page-board-section-list w-full margin m-auto p-8">
      <div className="font-semibold mb-2 flex gap-2"><UserRound /><span>Your Boards</span></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <FormPopover>
          <div
            role="button"
            className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
          </div>
        </FormPopover>
        {boards.map((board: any) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 h-full w-full px-1 py-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white p-1">{board.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
