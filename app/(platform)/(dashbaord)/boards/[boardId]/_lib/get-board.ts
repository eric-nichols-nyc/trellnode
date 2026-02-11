import { prisma } from "@/prisma";
import { Board, User } from "@prisma/client";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export async function getBoardById(boardId: string): Promise<Board | null> {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }

  let user: User | null = null;
  let board: Board | null = null;

  try {
    await connectToDatabase();
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
    });
  } catch (e) {
    console.log(e);
  }

  try {
    board = await prisma.board.findUnique({
      where: {
        userId: user?.id!,
        id: boardId,
      },
    });
    return board;
  } catch (e) {
    console.log(e);
    return null;
  }
}
