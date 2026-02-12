"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserRound, X } from "lucide-react";
import dynamic from "next/dynamic";
import { getBoards } from "@/actions/get-boards-action";
import type { Board } from "@prisma/client";

const FormPopover = dynamic(
  () =>
    import("@/components/form/form-popover").then((m) => ({
      default: m.FormPopover,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-video w-full rounded-sm bg-muted animate-pulse flex flex-col gap-y-1 items-center justify-center"
        aria-hidden
      >
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    ),
  }
);

type SwitchBoardsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SwitchBoardsModal({ open, onClose }: SwitchBoardsModalProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getBoards()
      .then(setBoards)
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Switch boards"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold flex gap-2">
            <UserRound className="size-5" />
            <span>Your Boards</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
          <FormPopover>
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
            </div>
          </FormPopover>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-sm bg-stone-100 animate-pulse"
                  aria-hidden
                />
              ))
            : boards.map((board) => (
                <Link
                  key={board.id}
                  href={`/boards/${board.id}`}
                  onClick={onClose}
                  className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 h-full w-full px-1 py-2 overflow-hidden rounded-sm"
                  style={{
                    backgroundImage: board.imageThumbUrl
                      ? `url(${board.imageThumbUrl})`
                      : undefined,
                  }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition rounded-sm" />
                  <p className="relative font-semibold text-white p-1">
                    {board.title}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </>
  );
}
