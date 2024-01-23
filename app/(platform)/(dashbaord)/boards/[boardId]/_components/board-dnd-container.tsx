"use client";
import { BoardDndList } from "./board-dnd-list";
import { startTransition, useEffect, useOptimistic } from "react";
import { ListWithCards } from "@/types";
import {
  DragDropContext,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import { updateListOrder } from "@/actions/update-list-order-action";
import { AddListForm } from "./add-list-form";
import { updateCardOrder } from "@/actions/update-card-order-action";

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

  // console.log("lists", lists);
  const [optimisticLists, setOptimisticLists] = useOptimistic(
    lists,
    (state, items:ListWithCards[]) => {
        return items;
    });

  async function getNewListOrder(items: ListWithCards[]) {
    try {
      const result = await updateListOrder({ items, boardId });
      // console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  async function getNewCardOrder(items: Card[]) {
    try {
      const result = await updateCardOrder({ items, boardId });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  function onDragEnd(result: DropResult) {
    const { destination, source, type } = result;
    if (!destination) return;

    // if item is dropped in the same position
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
      // user moves a card
    }else if(type === 'card'){
      // check to see if card exists in same list
      if(source.droppableId === destination.droppableId){
        // update card order
        const list = lists.find((list) => list.id === source.droppableId);
        if(!list) return;
        const cards = reorder(
          list.cards,
          source.index,
          destination.index
        ).map((card, i) => ({...card, order: i}))
        // reset lists with new card order
        const items = lists.map((list) => {
          if(list.id === source.droppableId){
            return {...list, cards}
          }
          return list;
        })
        // send update to optimistically update the list
        startTransition(() => {
          setOptimisticLists(items);
        });
        // send cards to db
        getNewCardOrder(cards)
      }else{
        // card is moved to another list
        const sourceList = lists.find((list) => list.id === source.droppableId);
        const destinationList = lists.find((list) => list.id === destination.droppableId);
        if(!sourceList || !destinationList) return;
        // remove card from source list
        const movedCard = sourceList.cards[source.index];
        // assign new list id to send to db
        movedCard.listId = destinationList.id;

        const newSourceCards = sourceList.cards.filter((card, i) => i !== source.index);
        // add card to destination list
        const newDestinationCards = destinationList.cards;
        newDestinationCards.splice(destination.index, 0, movedCard);
        // reset lists with new card order
        const items = lists.map((list) => {
          if(list.id === source.droppableId){
            return {...list, cards: newSourceCards}
          }
          if(list.id === destination.droppableId){
            return {...list, cards: newDestinationCards}
          }
          return list;
        })
        // send update to optimistically update the list
        startTransition(() => {
          setOptimisticLists(items);
        });
        // send cards to db
        getNewCardOrder(newSourceCards)
        getNewCardOrder(newDestinationCards)
      }
    }
  }

  useEffect(() => {
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
