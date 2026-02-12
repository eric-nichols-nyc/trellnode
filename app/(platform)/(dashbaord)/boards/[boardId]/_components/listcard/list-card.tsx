"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type CardWithImage = Card & { imageUrl?: string | null };

type ListCardProps = {
  card: CardWithImage;
  index: number;
  boardId: string;
};

export const ListCard = ({ card, index, boardId }: ListCardProps) => {
  const { title, imageUrl } = card;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <li
          className="rounded-md bg-white text-black shadow-md mb-2 text-sm overflow-hidden"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Link
            href={`/boards/${boardId}/card/${card.id}`}
            className="block hover:bg-black/5 transition-colors"
            {...provided.dragHandleProps}
          >
            {imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden">
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
            <div className="px-3 py-2 min-h-[32px]">
              {title || "Add a title..."}
            </div>
          </Link>
        </li>
      )}
    </Draggable>
  );
};
