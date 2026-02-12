"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Card } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCard } from "@/actions/update-card-action";

const TinyMCEEditor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then(
      (mod) => mod.Editor as React.ComponentType<React.ComponentProps<typeof mod.Editor>>
    ),
  { ssr: false }
);

type CardWithList = Card & { list?: { boardId: string }; description?: string | null };

type CardModalProps = {
  card: CardWithList;
  children?: React.ReactNode;
};

export function CardModal({ card, children }: CardModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(card.title);
  // Description is stored and edited as HTML from TinyMCE
  const [description, setDescription] = useState(
    typeof card.description === "string" ? card.description : ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const hasDescription =
    description.trim() !== "" &&
    description.replace(/<[^>]*>/g, "").trim() !== "";

  const boardId = card.list?.boardId;
  const handleClose = () => router.back();

  const runUpdateCard = async (payload: {
    id: string;
    title: string;
    boardId: string;
    description?: string;
  }) => {
    const result = await updateCard(payload);
    if (result && "success" in result && result.success) {
      setDescriptionError(null);
      return true;
    }
    let message = "Failed to save. Please try again.";
    if (result) {
      if (typeof (result as { message?: string }).message === "string") {
        message = (result as { message: string }).message;
      } else if (
        "errors" in result &&
        result.errors &&
        typeof result.errors === "object"
      ) {
        const first = Object.values(result.errors).flat().find(Boolean);
        if (typeof first === "string") message = first;
      }
    }
    setDescriptionError(message);
    toast.error(message);
    return false;
  };

  const saveDescription = async () => {
    if (!boardId) return;
    setIsSavingDescription(true);
    setDescriptionError(null);
    const ok = await runUpdateCard({
      id: card.id,
      title,
      boardId,
      description: description || undefined,
    });
    if (ok) {
      toast.success("Description saved");
      setIsEditingDescription(false);
    }
    setIsSavingDescription(false);
  };

  const startEditingDescription = () => setIsEditingDescription(true);

  const handleDescriptionBlur = async () => {
    if (!boardId) return;
    const result = await runUpdateCard({
      id: card.id,
      title,
      boardId,
      description: description || undefined,
    });
    if (result) {
      toast.success("Description saved");
      setIsEditingDescription(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);
    const formData = new FormData(e.currentTarget);
    const newTitle = (formData.get("title") as string)?.trim();
    if (newTitle && newTitle !== card.title && boardId) {
      const result = await updateCard({
        id: card.id,
        title: newTitle,
        boardId,
      });
      if (result && "success" in result && result.success) {
        setTitle(newTitle);
      } else {
        const msg =
          result && "message" in result
            ? result.message
            : "Failed to save title. Please try again.";
        toast.error(msg);
      }
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
        className="fixed left-1/2 top-8 z-50 w-full max-w-lg -translate-x-1/2 rounded-lg bg-white p-4 text-black shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
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
        <div className="mt-4">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
            Description
          </p>
          {isEditingDescription ? (
            <>
              <TinyMCEEditor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={description}
                onEditorChange={(newDescription) =>
                  setDescription(newDescription)
                }
                onBlur={handleDescriptionBlur}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: ["lists", "link"],
                  toolbar: "undo redo | bold italic | bullist numlist | link",
                  content_style:
                    "body { font-family: inherit; font-size: 14px; }",
                  placeholder: "Add a description...",
                  entity_encoding: "raw",
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={saveDescription}
                disabled={isSavingDescription}
              >
                {isSavingDescription ? "Saving…" : "Save description"}
              </Button>
            </>
          ) : hasDescription ? (
            <>
              <div
                className="rounded-md border border-stone-200 bg-stone-50/50 p-3 text-sm text-stone-700 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
                dangerouslySetInnerHTML={{ __html: description }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-stone-600 hover:text-stone-900"
                onClick={startEditingDescription}
              >
                <Pencil className="size-4 mr-1.5 inline" />
                Edit
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-start text-stone-500 hover:text-stone-700"
              onClick={startEditingDescription}
            >
              <Pencil className="size-4 mr-1.5" />
              Add a more detailed description
            </Button>
          )}
          {descriptionError && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {descriptionError}
            </p>
          )}
        </div>
        {children}
      </div>
    </>
  );
}
