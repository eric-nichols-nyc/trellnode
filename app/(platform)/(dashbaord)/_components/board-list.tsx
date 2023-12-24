"use client";

import Link from "next/link";

type BoardListProps = {
  addBoard: () => void;
  boards: any;
};
export const BoardList = ({ addBoard, boards }: BoardListProps) => {
  console.log("boards", boards);
  return (
    <div className="w-9/12">
      <div className="w-full grid grid-cols-3 gap-4 border">
        {boards.map((board: any) => (
          <Link href={`/boards/${board.id}`} key={board.id}
            role="button"
            className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            {board.title}
          </Link>
        ))}
        <div
          role="button"
          className="border aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          onClick={() => {
            addBoard();
          }}
        >
          Create new board
        </div>
      </div>
    </div>
  );
};
