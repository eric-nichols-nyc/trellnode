"use client";
import { BoardTitleForm } from "@/components/form/board-title-form";
import React from "react";
import { BoardOptions } from "./board-options";
import { Board } from "@prisma/client";

type BoardHeaderProps = {
  board: Board;
};

const BoardHeader = ({board}:BoardHeaderProps) => {
  return (
    <div className="w-full fixed h-14 z-[40] bg-black/50 top-14 flex items-center justify-between px-6 gap-x-4">
      <BoardTitleForm id={board.id} title={board.title} />
      <BoardOptions />
    </div>
  );
};

export default BoardHeader;
