import { connectToDatabase } from "@/lib/db";
import { User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Board } from "@prisma/client";
import { prisma } from "@/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import ListItem from "./list-item";



export const BoardListNav = async () => {
  const session = await getServerSession(options);
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
  return (
    <div>
      {boards?.map((board: Board) => (
        <ListItem key={board.id} board={board} />
      ))}
    </div>
  );
};
