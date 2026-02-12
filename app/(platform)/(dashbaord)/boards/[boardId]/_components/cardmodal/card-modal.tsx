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
import { Pencil, Plus, Calendar, CheckSquare, Paperclip, Check, Rocket, Zap, MessageSquare } from "lucide-react";
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

/** Signed-in user from DB (for comments display) */
type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
} | null;

type CardModalProps = {
  card: CardWithList;
  currentUser?: CurrentUser;
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
        <button
          type="button"
          onClick={() => onCompletedChange(!completed)}
          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-black bg-white hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-1"
          aria-label={completed ? "Mark card incomplete" : "Mark card complete"}
          aria-pressed={completed}
        >
          {completed && <Check className="size-3.5 stroke-[2.5] text-black" />}
        </button>
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
            <button
              type="button"
              onClick={startEditing}
              className="w-full min-w-0 text-left text-xl font-semibold rounded px-2 py-1 -mx-2 -my-1 hover:bg-black/5 min-h-[2rem]"
            >
              {title || "Add a title..."}
            </button>
          )}
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Card actions">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-stone-600 hover:text-stone-900"
        >
          <Plus className="size-4 mr-1.5" />
          Add
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-stone-600 hover:text-stone-900"
        >
          <Calendar className="size-4 mr-1.5" />
          Dates
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-stone-600 hover:text-stone-900"
        >
          <CheckSquare className="size-4 mr-1.5" />
          Checklist
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-stone-600 hover:text-stone-900"
        >
          <Paperclip className="size-4 mr-1.5" />
          Attachment
        </Button>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Description
          </p>
          {hasDescription && !isEditingDescription && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto py-0.5 px-1.5 text-xs text-stone-600 hover:text-stone-900 -mr-1"
              onClick={startEditingDescription}
            >
              <Pencil className="size-3 mr-1 inline" />
              Edit
            </Button>
          )}
        </div>
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
          <div
            className="rounded-md border border-stone-200 bg-stone-50/50 p-3 text-sm text-stone-700 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1"
            dangerouslySetInnerHTML={{ __html: description }}
          />
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

type CardDetailTabId = "power-ups" | "automations" | "comments";

function CardDetailTabs() {
  const [activeTab, setActiveTab] = useState<CardDetailTabId>("comments");

  const tabs: { id: CardDetailTabId; label: string; icon: React.ReactNode }[] = [
    { id: "power-ups", label: "Power-ups", icon: <Rocket className="size-4" /> },
    { id: "automations", label: "Automations", icon: <Zap className="size-4" /> },
    { id: "comments", label: "Comments", icon: <MessageSquare className="size-4" /> },
  ];

  return (
    <div
      className="inline-flex shrink-0 rounded-lg bg-stone-700 p-0.5"
      role="tablist"
      aria-label="Card details sections"
    >
      <div className="flex rounded-md">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="flex items-center">
              {index > 0 && (
                <div className="h-5 w-px shrink-0 bg-stone-500" aria-hidden />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "rounded-b-none bg-blue-600 text-white border-b-2 border-blue-400"
                    : "text-stone-300 hover:bg-stone-600 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CommentItem = { id: number; content: string };

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return (name.slice(0, 2) || "?").toUpperCase();
}

/** List of comments: 2 cols (initials | name + comment + edit/delete links) */
function CommentList({
  comments,
  currentUser,
  onEdit,
  onDelete,
}: {
  comments: CommentItem[];
  currentUser: CurrentUser;
  onEdit: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}) {
  const displayName = currentUser?.name ?? "You";
  const initials = currentUser ? getInitials(currentUser.name) : "Y";

  if (comments.length === 0) return null;
  return (
    <ul className="space-y-3 mt-3">
      {comments.map((comment) => (
        <li key={comment.id} className="grid grid-cols-[auto_1fr] gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs font-medium text-stone-700">
            {initials}
          </div>
          <div className="min-w-0 rounded-md bg-white border border-stone-200 p-2.5 shadow-sm">
            <p className="text-sm font-medium text-stone-800">{displayName}</p>
            <div
              className="mt-0.5 text-sm text-stone-600 prose prose-sm max-w-none prose-p:my-0.5 prose-ul:my-0.5 prose-ol:my-0.5"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(comment.id, comment.content)}
                className="text-xs text-stone-500 underline hover:text-stone-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                className="text-xs text-stone-500 underline hover:text-stone-700"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Comments and activity section: button toggles rich text editor; comments are local state only */
function Comments({ currentUser }: { currentUser: CurrentUser }) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [nextId, setNextId] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSave = () => {
    const trimmed = commentContent.replace(/<[^>]*>/g, "").trim();
    if (!trimmed) {
      setIsEditorOpen(false);
      setCommentContent("");
      setEditingId(null);
      return;
    }
    if (editingId !== null) {
      setComments((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, content: commentContent } : c))
      );
      setEditingId(null);
      toast.success("Comment updated");
    } else {
      setComments((prev) => [...prev, { id: nextId, content: commentContent }]);
      setNextId((n) => n + 1);
      toast.success("Comment added");
    }
    setCommentContent("");
    setIsEditorOpen(false);
  };

  const handleCancel = () => {
    setCommentContent("");
    setIsEditorOpen(false);
    setEditingId(null);
  };

  const handleEdit = (id: number, content: string) => {
    setCommentContent(content);
    setEditingId(id);
    setIsEditorOpen(true);
  };

  const handleDelete = (id: number) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-w-0 flex flex-col border-l border-stone-200 pl-4 rounded-r-lg bg-stone-100 py-3 pr-3">
      <h3 className="text-sm font-semibold text-stone-700 mb-3 px-1">
        Comments and activity
      </h3>
      {!isEditorOpen ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start text-stone-500 hover:text-stone-700"
          onClick={() => setIsEditorOpen(true)}
        >
          <Pencil className="size-4 mr-1.5" />
          Write a comment
        </Button>
      ) : (
        <div className="space-y-2">
          <TinyMCEEditor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={commentContent}
            onEditorChange={setCommentContent}
            init={{
              height: 120,
              menubar: false,
              plugins: ["lists", "link"],
              toolbar: "undo redo | bold italic | bullist numlist | link",
              content_style: "body { font-family: inherit; font-size: 14px; }",
              placeholder: "Write a comment...",
              entity_encoding: "raw",
            }}
          />
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSave}>
              {editingId !== null ? "Update" : "Save"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <CommentList
        comments={comments}
        currentUser={currentUser}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export function CardModal({ card, currentUser = null, children }: CardModalProps) {
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
    comment?: string;
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

  const handleCompletedChange = (newCompleted: boolean) => {
    setCompleted(newCompleted);
    // Not persisted to database — local state only
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
          <CardContent className="p-4 h-[465px] overflow-y-auto flex flex-col">
            <div className="grid grid-cols-[1fr_1fr] gap-4 flex-1 min-h-0">
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
              <Comments currentUser={currentUser} />
            </div>
            {children}
          </CardContent>
        </Card>
        <div className="mt-4 flex justify-center">
                <CardDetailTabs />
              </div>
      </div>
    </>
  );
}
