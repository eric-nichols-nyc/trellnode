"use client";
import { BoardTitleForm } from "@/components/form/board-title-form";
import React from "react";
import { BoardOptions } from "../boardoptions/board-options";
import { Board } from "@prisma/client";

type BoardHeaderProps = {
  board: Board;
};



const BoardHeader = ({board}:BoardHeaderProps) => {

  function getBgColor(){
    if(board.imagePrimaryColor){
      return board.imagePrimaryColor;
    }
    return "rgba(95,85,69,0.6)";
  }
  return (
    <div style={{backgroundColor:getBgColor()}} className="w-full opacity-85 fixed h-14 z-[40] flex items-center justify-between px-6 gap-x-4">
      <BoardTitleForm id={board.id} title={board.title} />
      <BoardOptions />
    </div>
  );
};

export default BoardHeader;
