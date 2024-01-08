import React, { useState } from "react";
import Image from "next/image";
import { UnsplashImageList } from "@/app/(platform)/(dashbaord)/_components/unsplash-image-list";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createBoard } from "@/actions/create-board-action";
import { Button } from "../ui/button";

type CreateBoardFormProps = {
  close: () => void;
};

export const CreateBoardForm = ({close}:CreateBoardFormProps) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [fetchedImgSrc, setFetchedImgSrc] = useState<string>("");

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
      close();
    } else if (result.errors) {
      setFieldErrors(result.errors);
    }
  }
  return (
    <div className="grid gap-4">
      <form onSubmit={handleAddBoard} className="grid gap-2">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Create Board</h4>
        </div>
        {/* header image */}
        <div 
        style={{backgroundImage: `url(${fetchedImgSrc})`}}
        className="space-y-2 border flex items-center justify-center w-[200px] h-[120px] m-auto" >
          <Image
            src="images/popover-form-header.svg"
            alt="header image"
            width={180}
            height={96}
          />
        </div>
        <UnsplashImageList id="image" errors={fieldErrors} fetchedImgSrc={setFetchedImgSrc}/>
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
  );
};
