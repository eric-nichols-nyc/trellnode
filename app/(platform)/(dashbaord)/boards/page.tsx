
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {connectToDatabase} from "@/lib/db";
import { prisma } from "@/prisma";
import { BoardList } from "../_components/board-list";
import { User, Board} from "@prisma/client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import { createBoard } from "@/actions/create-board-action";

const Boardspage = async() => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }

  let user: User | null = null;
  let boards:Board[] | null = null;

  try{
    await connectToDatabase();
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
    });
  }catch(e){
    console.log(e);
  }

  try{
    await connectToDatabase();
    boards = await prisma.board.findMany({
      where: {
        userId: user?.id!,
      },
    });
  }catch(e){
    console.log(e);
  }

  return <div className="w-full border flex justify-center">
    <BoardList boards={boards} />
  </div>;
};

export default Boardspage;
