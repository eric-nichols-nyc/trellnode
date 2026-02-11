"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateCard } from "@/actions/update-card-action";

type CardWithList = Card & { list?: { boardId: string } };

type CardModalProps = {
  card: CardWithList;
  children?: React.ReactNode;
};

export function CardModal({ card, children }: CardModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(card.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const boardId = card.list?.boardId;
  const handleClose = () => router.back();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    const formData = new FormData(e.currentTarget);
    const newTitle = (formData.get("title") as string)?.trim();
    if (newTitle && newTitle !== card.title && boardId) {
      await updateCard({ id: card.id, title: newTitle, boardId });
      setTitle(newTitle);
    } else if (newTitle) {
      setTitle(newTitle);
    }
  };

  const handleBlur = () => {
    if (inputRef.current?.value?.trim() !== card.title) {
      formRef.current?.requestSubmit();
    } else {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 text-black shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Card details"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {card.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md mb-3">
                <Image
                  src={card.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                  unoptimized
                />
              </div>
            )}
            {isEditing ? (
              <form onSubmit={onSubmit} ref={formRef}>
                <Input
                  ref={inputRef}
                  name="title"
                  defaultValue={title}
                  onBlur={handleBlur}
                  className="text-lg font-semibold border-gray-300 focus-visible:ring-gray-400"
                  placeholder="Enter a title..."
                />
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex-1 min-w-0 text-left text-lg font-semibold rounded px-2 py-1 -mx-2 -my-1 hover:bg-black/5 min-h-[2rem]"
                >
                  {title || "Add a title..."}
                </button>
                <button
                  type="button"
                  onClick={startEditing}
                  className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-black/10 hover:text-gray-600"
                  aria-label="Edit title"
                >
                  <Pencil className="size-4" />
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded p-1 text-gray-500 hover:bg-black/10 hover:text-gray-700"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
