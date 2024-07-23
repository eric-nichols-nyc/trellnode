"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import React from "react";

type ListCardProps = {
  card: Card;
  index: number;
};

export const ListCard = ({ card, index }: ListCardProps) => {
  const { title } = card;
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <li
          className="p-2 rounded-md bg-white text-black  shadow-md mb-2 text-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {title} - {index}
        </li>
      )}
    </Draggable>
  );
};
