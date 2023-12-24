
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {connectToDatabase} from "@/lib/db";
import { prisma } from "@/prisma";
import { BoardList } from "../_components/board-list";
import { User } from "@prisma/client";

export const revalidate = true;

const Boardspage = async() => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  console.log("page session", session);

  let user: User | null = null;
  let boards = null;
  try{
    await connectToDatabase();
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
    });

    console.log("user", user);

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
    console.log("boards", boards);
  }catch(e){
    console.log(e);
  }

  const addBoard = async() => {
    "use server"
   if(!user) return;
    try{
      await connectToDatabase();
      const board = await prisma.board.create({
        data: {
          title: "New Board",
          imageId: "GGDuawxHUwo",
          imageThumbUrl: "https://images.unsplash.com/photo-1629221892514-7abb71a803f7?crop=entropy%5Cu0026cs=tinysrgb%5Cu0026fit=max%5Cu0026fm=jpg%5Cu0026ixid=M3w1MjY4NzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk2OTcyNDN8%5Cu0026ixlib=rb-4.0.3%5Cu0026q=80%5Cu0026w=200",
          imageFullUrl:"https://images.unsplash.com/photo-1629221892514-7abb71a803f7?crop=entropy%5Cu0026cs=srgb%5Cu0026fm=jpg%5Cu0026ixid=M3w1MjY4NzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk2OTcyNDN8%5Cu0026ixlib=rb-4.0.3%5Cu0026q=85",
          imageUserName: "gantas",
          imageLinkHTML:"http://www.gantasv.com",
          userId: user.id,
          }
      });
      redirect(`/boards/${board.id}`);
      console.log("board", board);
    }catch(e){
      console.log(e);
    }
  }

  return <div className="w-full border flex justify-center">
    <BoardList addBoard={addBoard} boards={boards} />
  </div>;
};

export default Boardspage;
