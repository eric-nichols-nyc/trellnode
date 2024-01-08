"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UnsplashImageList } from "./unsplash-image-list";
import { useRouter } from "next/navigation";
import { createBoard } from "@/actions/create-board-action";
import { Board } from "@prisma/client";
import { ElementRef, useRef, useState } from "react";
import { X } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";

type BoardListProps = {
  boards: any;
};

export const BoardList = ({ boards }: BoardListProps) => {
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
    <div className="w-full max-w-4xl margin m-auto">
      <div className="font-semibold mb-2">Your Boards</div>
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
            href="#"
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
