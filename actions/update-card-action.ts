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
  description: z.string().optional(),
  completed: z.boolean().optional(),
  comment: z.string().optional(),
});

export async function updateCard(data: {
  title: string;
  id: string;
  boardId: string;
  description?: string;
  completed?: boolean;
  comment?: string;
}) {
  const session = await getServerSession(options);
  if (!session?.user) {
    redirect("/");
  }

  const validation = UpdateCardSchema.safeParse(data);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors).flat()[0];
    return {
      success: false,
      errors: fieldErrors,
      message: firstError ?? "Invalid card data",
    };
  }

  const { title, id, boardId, description, completed, comment } = validation.data;

  try {
    await connectToDatabase();
    await prisma.card.update({
      where: { id },
      data: {
        title,
        ...(description !== undefined && { description: description ?? null }),
        ...(completed !== undefined && { completed }),
      },
    });
    if (comment !== undefined && comment.trim() !== "") {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email ?? undefined },
      });
      if (user) {
        await (prisma as any).comment.create({
          data: {
            content: comment.trim(),
            cardId: id,
            userId: user.id,
          },
        });
      }
    }
    revalidatePath(`/boards/${boardId}`);
    return { success: true };
  } catch (e) {
    console.error("updateCard error:", e);
    const message =
      e instanceof Error ? e.message : "Unable to update card. Please try again.";
    return { success: false, message };
  }
}
