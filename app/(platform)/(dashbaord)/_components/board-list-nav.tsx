import { connectToDatabase } from "@/lib/db";
import { User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Board } from "@prisma/client";
import { prisma } from "@/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";
import {BoardDndListItem} from "./list-item";
import { ClipboardList, Plus } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import Link from "next/link";

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
    <>
      <Link href="/boards" className="p-2 flex gap-2 items-center text-sm hover:bg-slate-200"><ClipboardList size={16} />Boards</Link>
      <div className="flex justify-between items-center p-2 border">
        <div>
          <div className="text-sm font-semibold">Your boards</div>
        </div>
        <FormPopover>
          <Plus size={32} className="p-2 cursor-pointer hover:bg-slate-200" />
        </FormPopover>
      </div>
      {boards?.map((board: Board) => (
        <BoardDndListItem key={board.id} board={board} />
      ))}
    </>
  );
};
