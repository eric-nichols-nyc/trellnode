"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import Image from "next/image";
import React from "react";

type ListCardProps = {
  card: Card;
  index: number;
};

export const ListCard = ({ card, index }: ListCardProps) => {
  const { title, imageUrl } = card;
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <li
          className="p-2 rounded-md bg-white shadow-md mb-2 text-sm overflow-hidden"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {imageUrl && (
            <div className="relative -mx-2 -mt-2 mb-2 aspect-video w-[calc(100%+1rem)] overflow-hidden rounded-t-md">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="272px"
                unoptimized
              />
            </div>
          )}
          {title}
        </li>
      )}
    </Draggable>
  );
};
