"use client";
import { BoardDndList } from "./board-dnd-list";
import { startTransition, useEffect, useOptimistic } from "react";
import { ListWithCards } from "@/types";
import {
  DragDropContext,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { updateListOrder } from "@/actions/update-list-order-action";
import { AddListForm } from "./add-list-form";

// switch order of two items in an array
function reorder<T>(array: T[], startIndex: number, endIndex: number) {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

type BoardDnDProps = {
  boardId: string;
  lists: ListWithCards[];
};

/**
 *
 * useoptimiste update to update the list
 */
export const BoardDnD = ({ lists, boardId }: BoardDnDProps) => {

  console.log("lists", lists);
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

  useEffect(() => {
    console.log("lists", lists);
    startTransition(() => {
      setOptimisticLists(lists);
    });
  },[lists])

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
              <BoardDndList key={list.id} list={list} index={i} />
            ))}
            {provided.placeholder}
            {provided.placeholder}
            <AddListForm boardId={boardId} />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
