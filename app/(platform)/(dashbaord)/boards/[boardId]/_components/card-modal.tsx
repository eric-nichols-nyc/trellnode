"use client";

/**
 * Card modal: full card details in a dialog (title, image, description).
 * - Title is inline-editable; description uses TinyMCE and can be viewed or edited.
 * - Positioned near the top of the viewport; closes via backdrop click or close button.
 */

import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Card as PrismaCard } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { updateCard } from "@/actions/update-card-action";

// TinyMCE loads only on client to avoid SSR/document issues
const TinyMCEEditor = dynamic(
  () =>
    import("@tinymce/tinymce-react").then(
      (mod) => mod.Editor as React.ComponentType<React.ComponentProps<typeof mod.Editor>>
    ),
  { ssr: false }
);

type CardWithList = PrismaCard & {
  list?: { boardId: string };
  description?: string | null;
  completed?: boolean;
};

type CardModalProps = {
  card: CardWithList;
  children?: React.ReactNode;
};

/** Title and description section (inline-edit title + TinyMCE description) */
function CardDetails({
  title,
  completed,
  onCompletedChange,
  isEditing,
  formRef,
  textareaRef,
  onSubmit,
  handleBlur,
  startEditing,
  description,
  setDescription,
  isEditingDescription,
  hasDescription,
  descriptionError,
  saveDescription,
  startEditingDescription,
  handleDescriptionBlur,
  isSavingDescription,
}: {
  title: string;
  completed: boolean;
  onCompletedChange: (completed: boolean) => void;
  isEditing: boolean;
  formRef: React.RefObject<ElementRef<"form">>;
  textareaRef: React.RefObject<ElementRef<"textarea">>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleBlur: () => void;
  startEditing: () => void;
  description: string;
  setDescription: (v: string) => void;
  isEditingDescription: boolean;
  hasDescription: boolean;
  descriptionError: string | null;
  saveDescription: () => void;
  startEditingDescription: () => void;
  handleDescriptionBlur: () => void;
  isSavingDescription: boolean;
}) {
  return (
    <div className="min-w-0 flex flex-col">
      <div className="flex items-start gap-3 mb-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => onCompletedChange(e.target.checked)}
          className="mt-1.5 h-4 w-4 rounded border-stone-300 text-stone-600 focus:ring-stone-400"
          aria-label="Mark card complete"
        />
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={onSubmit} ref={formRef}>
              <Textarea
                ref={textareaRef}
                name="title"
                defaultValue={title}
                onBlur={handleBlur}
                className="text-xl font-semibold border-gray-300 focus-visible:ring-gray-400 min-h-[60px] resize-y"
                placeholder="Enter a title..."
              />
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startEditing}
                className="flex-1 min-w-0 text-left text-xl font-semibold rounded px-2 py-1 -mx-2 -my-1 hover:bg-black/5 min-h-[2rem]"
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
      </div>
      <div>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
          Description
        </p>
        {isEditingDescription ? (
          <>
            <TinyMCEEditor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={description}
              onEditorChange={(newDescription) => setDescription(newDescription)}
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
    </div>
  );
}

/** Comments and activity section */
function Comments() {
  return (
    <div className="min-w-0 flex flex-col border-l border-stone-200 pl-4">
      <h3 className="text-sm font-semibold text-stone-700 mb-3">
        Comments and activity
      </h3>
      <Textarea
        placeholder="Write a comment"
        className="bg-stone-50 border-stone-200 min-h-[80px] resize-y"
      />
    </div>
  );
}

export function CardModal({ card, children }: CardModalProps) {
  const router = useRouter();

  // Title editing (inline)
  const [title, setTitle] = useState(card.title);
  const [completed, setCompleted] = useState(card.completed ?? false);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  // Description: stored as HTML from TinyMCE; view vs edit mode
  const [description, setDescription] = useState(
    typeof card.description === "string" ? card.description : ""
  );
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  /** True when description has real content (ignores empty tags like <p></p>) */
  const hasDescription =
    description.trim() !== "" &&
    description.replace(/<[^>]*>/g, "").trim() !== "";

  const boardId = card.list?.boardId;
  const handleClose = () => router.back();

  /** Calls updateCard and handles success/error; returns true if saved successfully */
  const runUpdateCard = async (payload: {
    id: string;
    title: string;
    boardId: string;
    description?: string;
    completed?: boolean;
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

  /** Save description via button; on success switch back to view mode */
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

  const handleCompletedChange = async (newCompleted: boolean) => {
    setCompleted(newCompleted);
    if (boardId) {
      const ok = await runUpdateCard({
        id: card.id,
        title: (title || card.title || "").trim() || "Untitled",
        boardId,
        completed: newCompleted,
      });
      if (!ok) setCompleted(!newCompleted);
    }
  };

  /** Auto-save description when editor loses focus */
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

  /** Submit title form: persist new title and exit edit mode */
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

  /** On title input blur: submit if changed, else cancel edit */
  const handleBlur = () => {
    if (textareaRef.current?.value?.trim() !== card.title) {
      formRef.current?.requestSubmit();
    } else {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    });
  };

  return (
    <>
      {/* Backdrop: click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden
      />
      {/* Modal panel: shadcn Card, top-aligned */}
      <div
        className="fixed left-1/2 top-8 z-50 w-full max-w-6xl -translate-x-1/2 max-h-[calc(100vh-4rem)] overflow-y-auto px-4"
        role="dialog"
        aria-modal="true"
        aria-label="Card details"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-xl bg-white text-black">
          <CardHeader
            className={`relative ${card.imageUrl ? "p-0" : "p-2 min-h-[48px]"}`}
          >
            {card.imageUrl && (
              <div className="relative h-[160px] w-full overflow-hidden rounded-t-lg">
                <Image
                  src={card.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 672px) 100vw, 672px"
                  unoptimized
                />
              </div>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </CardHeader>
          <CardContent className="p-4 h-[465px] overflow-y-auto">
            <div className="grid grid-cols-[1fr_1fr] gap-4 h-full">
              <div className="min-w-0 overflow-y-auto pr-4">
                <CardDetails
                  title={title}
                  completed={completed}
                  onCompletedChange={handleCompletedChange}
                  isEditing={isEditing}
                  formRef={formRef}
                  textareaRef={textareaRef}
                  onSubmit={onSubmit}
                  handleBlur={handleBlur}
                  startEditing={startEditing}
                  description={description}
                  setDescription={setDescription}
                  isEditingDescription={isEditingDescription}
                  hasDescription={hasDescription}
                  descriptionError={descriptionError}
                  saveDescription={saveDescription}
                  startEditingDescription={startEditingDescription}
                  handleDescriptionBlur={handleDescriptionBlur}
                  isSavingDescription={isSavingDescription}
                />
              </div>
              <Comments />
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
