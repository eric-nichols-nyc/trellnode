import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@prisma/client";

type PageProps = {
  params: Promise<{ boardId: string; cardId: string }>;
};

async function getCard(cardId: string) {
  const session = await getServerSession(options);
  if (!session?.user?.email) {
    redirect("/");
  }

  try {
    await connectToDatabase();
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { list: { select: { boardId: true, title: true } } },
    });
    return card;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function CardPage({ params }: PageProps) {
  const { boardId, cardId } = await params;
  const card = await getCard(cardId);
  if (!card || card.list.boardId !== boardId) notFound();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/boards/${boardId}`}
          className="mb-4 inline-block text-sm text-gray-600 hover:underline"
        >
          ← Back to board
        </Link>
        <article className="rounded-lg bg-white p-6 shadow-md text-black">
          {card.imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md mb-4">
              <Image
                src={card.imageUrl}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
                unoptimized
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mb-1">In list: {card.list.title}</p>
          <h1 className="text-xl font-semibold">{card.title || "Untitled"}</h1>
        </article>
      </div>
    </div>
  );
}
