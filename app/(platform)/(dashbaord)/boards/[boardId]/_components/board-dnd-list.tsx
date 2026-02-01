"use client";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ListHeader } from "./list-header";
import { Card } from "@prisma/client";
import { AddForm } from "./add-form";
import { ListCard } from "./list-card";
import { createCard } from "@/actions/create-card-action";
import { ListWithCards } from "@/types";

type BoardDndListProps = {
  list: ListWithCards;
  index: number;
};

export const BoardDndList = ({ list, index }: BoardDndListProps) => {
  const { title, id, boardId } = list;
  const { cards } = list;

  async function onAddCardSubmitHandler(data: FormData) {
    // add card
    const title = data.get("title") as string;
    const order = cards.length + 1 || 1;
    const newCard = await createCard({
      title,
      order,
      listId: id,
      boardId: boardId,
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
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader data={list} />
            <Droppable droppableId={id} type="card">
              {(provided, snapshot) => (
                <ol
                  className="px-2 mt-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {cards?.map((card: Card, index: number) => (
                    <ListCard
                      card={card}
                      key={card.id}
                      index={index}
                      boardId={boardId}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
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
