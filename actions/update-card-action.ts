"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UpdateCardSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title is too long"),
  id: z.string(),
  boardId: z.string(),
});

export async function updateCard(data: {
  title: string;
  id: string;
  boardId: string;
}) {
  const session = await getServerSession(options);
  if (!session?.user) {
    redirect("/");
  }

  const validation = UpdateCardSchema.safeParse(data);
  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const { title, id, boardId } = validation.data;

  try {
    await connectToDatabase();
    await prisma.card.update({
      where: { id },
      data: { title },
    });
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { message: "Unable to update card" };
  }
}
