"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import type { Board } from "@prisma/client";

export async function getBoards(): Promise<Board[]> {
  const session = await getServerSession(options);
  if (!session?.user?.email) return [];

  try {
    await connectToDatabase();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return [];

    const boards = await prisma.board.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return boards;
  } catch (e) {
    console.error(e);
    return [];
  }
}
