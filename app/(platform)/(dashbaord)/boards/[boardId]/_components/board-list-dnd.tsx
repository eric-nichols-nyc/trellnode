"use client";
import { ListWithCards } from "@/types";
import {
  DragDropContext,
  DragDropContextProps,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { BoardList } from "./board-list-item";

type BoardDnDProps = {
  boardId: string;
  lists: ListWithCards[] | undefined;
};

function onDragEnd(result: DropResult) {
  console.log(result);
}

const BoardDnD = ({ lists }: BoardDnDProps) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided, snapshot) => (
          <ol
            className="flex gap-x-3 h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {lists?.map((list: ListWithCards, i) => (
                <BoardList key={list.id} list={list} index={i} />
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BoardDnD;
