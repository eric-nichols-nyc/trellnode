"use client";

import { TitleForm } from "@/components/form/title-form";
import { updateBoard } from "@/actions/update-board-action";
import { ListOptions } from "./list-options";
import { ListWithCards } from "@/types";

type ListHeaderProps = {
  data: ListWithCards;
};
export const ListHeader = ({ data }: ListHeaderProps) => {
  const { id, title, boardId } = data;

  async function uptateListTitle() {
    // update list title
    try {
      const response = await updateBoard({ title, id });
      // show sonnar if there was an error
    } catch (e) {
      console.log("there was an error...");
    }
  }
  return (
    <div className="relative text-sm">
      <TitleForm title={title} id={id} update={uptateListTitle} />
      <ListOptions listId={id} boardId={boardId} />
    </div>
  );
};
