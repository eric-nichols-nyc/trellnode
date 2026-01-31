/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { UnsplashImageList } from "@/app/(platform)/(dashbaord)/_components/unsplash/unsplash-image-list";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createBoard } from "@/actions/create-board-action";
import { Button } from "../../ui/button";
import { Board } from "@prisma/client";
import ColorThief from "colorthief";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreateBoardFormProps = {
  close: () => void;
};
/**
 * 
 * user can create a board
 * user selects image and title and send bg info to server action
 */
export const CreateBoardForm = ({ close }: CreateBoardFormProps) => {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [fetchedImgSrc, setFetchedImgSrc] = useState<string>("");
  const [imageData, setImageData] = useState<Board | null>(null);
  const [bgColors, setBgColors] = useState<string[] | null>([])
  const [bgbrightness, setBgBrightness] = useState('dark')
  const [selected, setSelected] = useState<string | null>(null);

  async function handleAddBoard(e: any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;
    if (!image || image.startsWith("undefined") || !image.includes("|")) {
      toast.error("Please select a background image first.");
      return;
    }
    const image_split = image.split("|");
    const imageId = image_split[0];
    const imageThumbUrl = image_split[1];
    const imageFullUrl = image_split[2];
    const imageLinkHTML = image_split[3];
    const imageUserName = image_split[4];
    if (!imageId || !imageThumbUrl || !imageFullUrl || imageThumbUrl === "undefined") {
      toast.error("Please select a background image first.");
      return;
    }
    // call to server action
    const obj = {
      title,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageLinkHTML,
      imageUserName,
      imagePrimaryColor: bgColors ? bgColors[0] : '',
      imageSecondaryColor: bgColors ? bgColors[1] : '',
      backgroundBrightness: bgbrightness
    };
    const result = (await createBoard(obj)) as any;
    if (result.id) {
      router.push(`/boards/${result.id}`);
      close();
    } else if (result.errors) {
      // validation errors
      console.log(result.errors);
      setFieldErrors(result.errors);
      // server error
    } else if (result.message) {
      toast.error(result.message);
      // missing data
    } else if (result.error) {
      toast.error(result.error);
    }
  }

  // add image data
  function handleImageData(data: Board) {
    console.log("d data", data);
    setImageData(data);
    setFetchedImgSrc(data.imageThumbUrl);
    setSelected(data.imageId);
  }

  function handleBgImageLoaded(img: React.SyntheticEvent<HTMLImageElement, Event>): void {
    const colorThief = new ColorThief();
    const colorPalette = colorThief.getPalette(img.target, 2);
    setBgColors(colorPalette.map((color:string[]) => `rgb(${color[0]}, ${color[1]}, ${color[2]})`));
    setBgBrightness(isColorDark(colorPalette[0][0], colorPalette[0][1], colorPalette[0][2]))
  }

  // find primary color and send to zustand
  function isColorDark(r: number, g: number, b: number): string {
    // Calculate relative luminance
    const luminance: number = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    // Check if the color is dark or light based on luminance threshold
    if (luminance <= 0.5) {
        return 'dark';
    } else {
        return 'light';
    }
}

  return (
    <div className="grid gap-4">
      <form onSubmit={handleAddBoard} className="grid gap-2">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Create Board</h4>
        </div>
        {/* header image */}
        <div className="relative space-y-2 border flex items-center justify-center w-[200px] h-[120px] m-auto">
          <img src={fetchedImgSrc} className="w-full h-full" crossOrigin="anonymous" alt="header image" onLoad={(img) => handleBgImageLoaded(img)} />
          <Image
            className="absolute top-0 left-2"
            src="/images/popover-form-header.svg"
            alt="header image"
            width={180}
            height={96}
          />
               <div className="mt-10">
               {
           
          bgColors?.map((color:string) => (
            <div key={color} style={{backgroundColor: color}} className="w-4 h-4 rounded-full border border-white"></div>
          ))
      
        }
            </div>
        </div>
   
        <UnsplashImageList
          id="image"
          errors={fieldErrors}
          fetchedImgSrc={setFetchedImgSrc}
          setImageData={handleImageData}
          selected={selected}
        />
        <div className="flex flex-col gap-2">
          <Label htmlFor="width">Board Title</Label>
          <Input id="width" className="col-span-2 h-8" name="title" />
        </div>
        <input
          type="hidden"
          name="image"
          value={`${imageData?.imageId}|${imageData?.imageThumbUrl}|${imageData?.imageFullUrl}|${imageData?.imageLinkHTML}|${imageData?.imageUserName}`}
        />
        <div className="flex gap-2 text-xs">
          <span role="img" aria-label="wave">
            👋
          </span>
          <p>Board title is required</p>
        </div>
        <div>
          {fieldErrors.title?.map((error: string) => (
            <p key={error} className="text-red-500">
              {error}
            </p>
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={!imageData}>
          Create
        </Button>
      </form>
    </div>
  );
};
