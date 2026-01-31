"use client";
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

  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    const getImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/unsplash?count=9&collectionIds=317099");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Failed to load images");
          setImages([]);
          return;
        }
        const gallery = Array.isArray(data) ? data : [];
        if (gallery.length > 0) {
          const first = gallery[0];
          const thumb = first.urls?.thumb ?? first.urls?.small;
          if (thumb) fetchedImgSrc(thumb);
          setImages(gallery);
        } else {
          setError("No images returned");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load images");
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
        <Loader2 data-testid="loader-component" className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border p-4 rounded-md bg-destructive/10">
        <p className="text-sm text-destructive">{error}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Check UNSPLASH_ACCESS_KEY or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in .env
        </p>
      </div>
    );
  }

  return (
    <div className="relative">

      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (

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
                src={image.urls?.thumb ?? "/images/next.svg"}
                alt={image.alt_description ?? "Unsplash"}
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
