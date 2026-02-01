"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

/**
 * Deletes the current user's account. Cascade delete (Board → List → Card)
 * removes all their boards, lists, and cards. Caller should signOut and redirect after.
 */
export async function deleteAccount(): Promise<{ error?: string }> {
  const session = await getServerSession(options);
  if (!session?.user?.id) {
    redirect("/");
  }

  try {
    await connectToDatabase();
    await prisma.user.delete({
      where: { id: session.user.id },
    });
    return {};
  } catch (e) {
    console.error(e);
    return { error: "Could not delete account. Please try again." };
  }
}
