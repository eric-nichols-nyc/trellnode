"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import Image from "next/image";
import React, { ElementRef, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { updateCard } from "@/actions/update-card-action";

type CardWithImage = Card & { imageUrl?: string | null };

type ListCardProps = {
  card: CardWithImage;
  index: number;
  boardId: string;
};

export const ListCard = ({ card, index, boardId }: ListCardProps) => {
  const { title, imageUrl } = card;
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    const formData = new FormData(e.currentTarget);
    const newTitle = (formData.get("title") as string)?.trim();
    if (newTitle && newTitle !== title) {
      await updateCard({ id: card.id, title: newTitle, boardId });
    }
  };

  const handleBlur = () => {
    if (inputRef.current?.value?.trim() !== title) {
      formRef.current?.requestSubmit();
    } else {
      setIsEditing(false);
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <li
          className="rounded-md bg-white text-black shadow-md mb-2 text-sm overflow-hidden"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="272px"
                unoptimized
              />
            </div>
          )}
          <div className="px-3 py-2">
            {isEditing ? (
              <form onSubmit={onSubmit} ref={formRef}>
                <Input
                  ref={inputRef}
                  name="title"
                  defaultValue={title}
                  onBlur={handleBlur}
                  className="h-8 text-sm border-none shadow-none focus-visible:ring-0 px-0"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={enableEditing}
                className="w-full text-left min-h-[32px] hover:bg-black/5 rounded px-0 -mx-0"
              >
                {title || "Add a title..."}
              </button>
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
};
