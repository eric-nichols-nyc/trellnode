
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {connectToDatabase} from "@/lib/db";
import { prisma } from "@/prisma";
import { BoardList } from "../_components/board-list";
import { User, Board} from "@prisma/client";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const revalidate = true;

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

  const addBoard = async(title:any | null) => {
    "use server"
   if(!user) return;
   console.log(title)
    try{
      await connectToDatabase();
      const board = await prisma.board.create({
        data: {
          title: title,
          imageId: "GGDuawxHUwo",
          imageThumbUrl: "https://images.unsplash.com/photo-1629221892514-7abb71a803f7?crop=entropy%5Cu0026cs=tinysrgb%5Cu0026fit=max%5Cu0026fm=jpg%5Cu0026ixid=M3w1MjY4NzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk2OTcyNDN8%5Cu0026ixlib=rb-4.0.3%5Cu0026q=80%5Cu0026w=200",
          imageFullUrl:"https://images.unsplash.com/photo-1629221892514-7abb71a803f7?crop=entropy%5Cu0026cs=srgb%5Cu0026fm=jpg%5Cu0026ixid=M3w1MjY4NzN8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTk2OTcyNDN8%5Cu0026ixlib=rb-4.0.3%5Cu0026q=85",
          imageUserName: "gantas",
          imageLinkHTML:"http://www.gantasv.com",
          userId: user.id,
          }
      });
      console.log('Successfully created board', board)
      return board
    }catch(e){
      console.log("There was an error...", e);
      return {messsage: 'There was an error creating the board'}
    }
  }

  return <div className="w-full border flex justify-center">
    <BoardList addBoard={addBoard} boards={boards} />
  </div>;
};

export default Boardspage;
