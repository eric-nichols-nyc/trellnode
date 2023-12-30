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
    <div className="w-9/12">
      <div className="font-semibold mb-2">Your Boards</div>
      <div className="w-full grid grid-cols-4 gap-4">

        {boards.map((board: any) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <div
              role="button"
              className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
               <p className="text-sm">Create new board</p>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="left">
          <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
            <div className="grid gap-4">
              <form onSubmit={handleAddBoard} className="grid gap-2">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Create Board</h4>
                </div>
                <div className="space-y-2">
                  <Image
                    src="images/popover-form-header.svg"
                    alt="header image"
                    width={186}
                    height={100}
                  />
                  <UnsplashImageList id="image" errors={fieldErrors} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="width">Board Title</Label>
                  <Input id="width" className="col-span-2 h-8" name="title" />
                </div>
                <div className="flex gap-2 text-xs">
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                  <p>Board title is required</p>
                </div>
                <div>
                  {fieldErrors.title?.map((error: string) => (
                    <p className="text-red-500">{error}</p>
                  ))}
                </div>
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </form>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
