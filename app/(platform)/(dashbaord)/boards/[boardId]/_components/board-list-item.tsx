"use client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListHeader } from "./list-header";
import { Card } from "@prisma/client";
import { AddForm } from "./add-form";
import { ListCard } from "./list-card";
import { createCard } from "@/actions/create-card-action";
import { ListWithCards } from "@/types";

type BoardListProps = {
  list: ListWithCards;
  index: number;
};

export const BoardList = ({ list, index }: BoardListProps) => {
  const { title, id } = list;
  const { cards } = list;

  async function onAddCardSubmitHandler(data: FormData) {
    // add card
    const title = data.get("title") as string;
    const order = cards.length + 1 || 1;
    const newCard = await createCard({
      title,
      order,
      listId: id,
      boardId: list.boardId,
    });
  }
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <li
          className="shrink-0 h-full w-[272px] select-none"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div 
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
            <ListHeader id={id} title={title} />
            <ol className="px-2">
              {
                // Cards
                cards?.map((card: Card) => (
                  <ListCard card={card} key={card.id} />
                ))
              }
            </ol>
            <AddForm
              action={onAddCardSubmitHandler}
              btnText="Add a card"
              placeholder="Enter a title for this card..."
              submitTxt="Add Card"
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};
