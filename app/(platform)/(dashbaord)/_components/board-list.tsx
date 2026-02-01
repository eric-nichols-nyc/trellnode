"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import dynamic from "next/dynamic";

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
type BoardListProps = {
  boards: any;
};

export const AllBoardsList = ({ boards }: BoardListProps) => {

  return (
    <div className="boards-page-board-section-list w-full margin m-auto p-8">
      <div className="font-semibold mb-2 flex gap-2"><UserRound /><span>Your Boards</span></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <FormPopover>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
          </div>
        </FormPopover>
        {(boards ?? []).map((board: any) => (
          <Link
            key={board.id}
            href={`/boards/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 h-full w-full px-1 py-2 overflow-hidden"
            style={{ backgroundImage: board.imageThumbUrl ? `url(${board.imageThumbUrl})` : undefined }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white p-1">{board.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
