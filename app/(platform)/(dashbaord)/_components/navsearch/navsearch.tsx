import { connectToDatabase } from "@/lib/db";
import { Board, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { NavSearchBarForm } from "./navsearchbar-form";

async function getBoards() {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }

  let user: User | null = null;
  let boards: Board[] | null = null;

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
    boards = await prisma.board.findMany({
      where: {
        userId: user?.id!,
      },
    });
  } catch (e) {
    console.log(e);
  }

  return boards;
}
export const NavSearch = async () => {
  const boards = await getBoards();
  return (
    <div className="w-full">
      <NavSearchBarForm boards={boards} />
    </div>
  );
};
