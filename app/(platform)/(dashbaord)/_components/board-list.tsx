"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UnsplashImageList } from "./unsplash-image-list";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

type BoardListProps = {
  addBoard: (title:FormDataEntryValue | null) => void;
  boards: any;
};


export const BoardList = ({ addBoard, boards }: BoardListProps) => {
  const router = useRouter();

    async function handleAddBoard(e:any){
        e.preventDefault();
        console.log(e.currentTarget)
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title');
        if(!title) return;
        console.log(title)
        const result = await addBoard(title) as any
        if(result.id){
          router.push(`/boards/${result.id}`)
        }else{
          alert('Something went wrong')
        }
    }
  return (
    <div className="w-9/12">
      <div className="w-full grid grid-cols-4 gap-4">
        {boards.map((board: any) => (
          <Link href={`/boards/${board.id}`} key={board.id}
            role="button"
            className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            {board.title}
          </Link>
        ))}

    <Popover >
      <PopoverTrigger asChild>
      <div
          role="button"
          className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
        >
          Create new board
        </div>
        </PopoverTrigger>
      <PopoverContent className="w-80" side="left">
        <div className="grid gap-4">
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
          <UnsplashImageList />
          </div>
          <form onSubmit={handleAddBoard}className="grid gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="width">Board Title</Label>
              <Input
                id="width"
                className="col-span-2 h-8"
                name="title"
              />
            </div>
            <div className="flex gap-2">
            <span role="img" aria-label="wave">👋</span>
            <p>Board title is required</p>
            </div>
            <Button
                type="submit"
                className="w-full"
            >Create
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
      </div>
    </div>
  );
};
