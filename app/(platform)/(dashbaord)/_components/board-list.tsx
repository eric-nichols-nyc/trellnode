"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

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
          <Card
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
          </Card>
        </FormPopover>
        {(boards ?? []).map((board: any) => (
          <Link key={board.id} href={`/boards/${board.id}`} className="block aspect-video">
            <Card className="group flex flex-col h-full w-full rounded-lg overflow-hidden bg-stone-800 border-stone-700 hover:opacity-95 transition-opacity">
              <div
                className="flex-[7] min-h-0 bg-blue-600"
                style={
                  board.imageThumbUrl
                    ? { backgroundImage: `url(${board.imageThumbUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : undefined
                }
              />
              <div className="flex-[3] flex items-end px-3 py-2.5 bg-stone-800 min-h-0">
                <p className="font-semibold text-stone-100 text-sm truncate w-full">
                  {board.title}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
