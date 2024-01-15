import { connectToDatabase } from "@/lib/db";
import { User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Board } from "@prisma/client";
import { prisma } from "@/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import {BoardListItem} from "./list-item";
import { Plus } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";

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
      <div className="flex justify-between">
        <div>Board Items</div>
        <FormPopover>
          <Plus className="h-4 w-4 cursor-pointer" />
        </FormPopover>
      </div>
      {boards?.map((board: Board) => (
        <BoardListItem key={board.id} board={board} />
      ))}
    </div>
  );
};
