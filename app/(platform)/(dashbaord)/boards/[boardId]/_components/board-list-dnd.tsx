"use client";
import { ListWithCards } from "@/types";
import {
  DragDropContext,
  DragDropContextProps,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { updateListOrder } from "@/actions/update-list-order-action";

// switch order of two items in an array
function reorder<T>(array: T[], startIndex: number, endIndex: number) {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

import { BoardList } from "./board-list-item";
import { startTransition, useOptimistic } from "react";
import { List } from "@prisma/client";

type BoardDnDProps = {
  boardId: string;
  lists: ListWithCards[] | [];
};

/**
 *
 * useoptimiste update to update the list
 */
const BoardDnD = ({ lists, boardId }: BoardDnDProps) => {
  const [optimisticLists, setOptimisticLists] = useOptimistic(
    lists,
    (state, items:ListWithCards[]) => {
        return items;
    });
  /**
   *
   * useoptimiste update to update the list
   */
  async function getNewListOrder(items: ListWithCards[]) {
    const result = await updateListOrder({ items, boardId });
  }

  function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;
    if (!destination) return;

    // if droppend in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "list") {
      // update list order
      const items = reorder(
        lists,
        source.index,
        destination.index
      ).map((list: ListWithCards, i: number) => ({...list, order: i})) as ListWithCards[];
      startTransition(() => {
        setOptimisticLists(items);
      });
      getNewListOrder(items)
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided, snapshot) => (
          <ol
            className="flex gap-x-3 h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {optimisticLists?.map((list: ListWithCards, i:number) => (
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
