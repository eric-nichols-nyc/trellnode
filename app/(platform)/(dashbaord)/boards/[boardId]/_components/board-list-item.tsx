"use client";
import { ListHeader } from "./list-header";
import { Card, List } from "@prisma/client";
import { AddForm } from "./add-form";
import { ListCard } from "./list-card";
import { createCard } from "@/actions/create-card-action";
import { ListWithCards } from "@/types";

type BoardListProps = {
  list: ListWithCards;
};
type CardData = {
  title: string;
  id?: string;
  order: number;
};

export const BoardList = ({ list }: BoardListProps) => {
  const { title, id } = list;
  const {cards} = list;

  async function onAddCardSubmitHandler(data: FormData) {
    // add card
    const title = data.get("title") as string;
    const order = 0;
    const newCard = await createCard({ title, order, listId: id, boardId: list.boardId });
    console.log('new card', newCard)
  }
  return (
    <div className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader id={id} title={title} />
        {
          // Cards
          cards?.map((card: Card) => (
            <ListCard key={card.id} />
          ))
        }
        <AddForm action={onAddCardSubmitHandler} btnText="Add a card" />
      </div>
    </div>
  );
};
