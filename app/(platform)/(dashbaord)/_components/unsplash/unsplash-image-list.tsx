"use client";
import { unsplash } from "@/lib/unsplash";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type UnsplashImageListProps = {
  id: string;
  setImageData:(data:any) => void;
  fetchedImgSrc: (src: string) => void;
  selected: string | null;
  errors?: Record<string, string[] | undefined>;
};

export const UnsplashImageList = ({ id, errors, setImageData, fetchedImgSrc }: UnsplashImageListProps) => {

  // assign the image list to a variable
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);


  useEffect(() => {
    const getImages = async () => {
      try {
        const response = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });
        if (response && response.response) {
          // console.log(response.response);
          const gallery = response.response as Array<Record<string, any>>;
          fetchedImgSrc(gallery[0].urls.thumb)
          setImages(gallery);
        } else {
          console.error("No response from Unsplash");
          setImages([]);
        }
      } catch (error) {
        console.log(error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    getImages();
  }, [fetchedImgSrc]);


  function setBgImages(data:any){
    setSelectedImageId(data.id)
    const imageData = {
      imageId: data.id,
      imageThumbUrl: data.urls.thumb,
      imageFullUrl: data.urls.regular,
      imageLinkHTML: data.links.html,
      imageUserName: data.user.name,
    }
    setImageData(imageData)
  }

  if (loading) {
    return (
      <div className="w-full h-20 border p-6 flex items-center justify-center">
        <Loader2 test-id="loader-component" className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <>
            <div
              key={image.id}
              className="cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted"
              role="button"
              onClick={() => setBgImages(image)}
            >
              <input
                type="radio"
                id={id}
                name={id}
                className="hidden"
                defaultChecked={selectedImageId === image.id}
                disabled={loading}
                value={`${image.id}|${image.urls.thumb}|${image.urls.regular}|${image.links.html}|${image.user.name}`}
              />
              <Image
                src={image.urls.thumb}
                alt={image.alt_description}
                className="object-cover"
                fill
              />
              <Link
                href={image.links.html}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
              >
                {image.user.name}
              </Link>
              {
                selectedImageId === image.id && (
                  <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
                )
              }
            </div>
          </>
        ))}
      </div>
      <div>
        {errors?.image?.map((error: string) => (
          <p key={error} className="text-red-500">{error}</p>
        ))}
      </div>
    </div>
  );
};
