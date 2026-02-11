import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect, notFound } from "next/navigation";
import { getBoardById } from "../../_lib/get-board";
import { BoardView } from "../../_components/board-view";

type PageProps = {
  params: Promise<{ cardId: string }>;
};

async function getCardBoardId(cardId: string) {
  const session = await getServerSession(options);
  if (!session?.user?.email) {
    redirect("/");
  }

  try {
    await connectToDatabase();
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      select: { list: { select: { boardId: true } } },
    });
    return card?.list?.boardId ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function InterceptedCardPage({ params }: PageProps) {
  const { cardId } = await params;
  const boardId = await getCardBoardId(cardId);
  if (!boardId) notFound();

  const board = await getBoardById(boardId);
  if (!board) notFound();

  return <BoardView board={board} />;
}
