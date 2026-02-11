"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card } from "@prisma/client";

type CardWithList = Card & { list?: { boardId: string } };

type CardModalProps = {
  card: CardWithList;
  children?: React.ReactNode;
};

export function CardModal({ card, children }: CardModalProps) {
  const router = useRouter();

  const handleClose = () => router.back();

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 text-black shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Card details"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {card.imageUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md mb-3">
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                  unoptimized
                />
              </div>
            )}
            <h2 className="text-lg font-semibold">{card.title || "Untitled"}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded p-1 text-gray-500 hover:bg-black/10 hover:text-gray-700"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
