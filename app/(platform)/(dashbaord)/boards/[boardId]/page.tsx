import BoardHeader from "./_components/board-header";
import { prisma } from "@/prisma";
import { Board, User } from "@prisma/client";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { BoardLists } from "./_components/board-lists";

type BoardIdPageProps = {
  params: {
    boardId: string;
  };
};

const getBoardById = async (boardId: string) => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }

  let user: User | null = null;
  let board: Board | null = null;

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
    board = await prisma.board.findUnique({
      where: {
        userId: user?.id!,
        id: boardId,
      },
    });
    return board;
  } catch (e) {
    console.log(e);
  }
};

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const board = await getBoardById(params.boardId);

  if(!board){
    return (<p>Sorry not found</p>)
  }

  return (
    <div className="relative h-full bg-no-repeat bg-cover bg-center" style={{backgroundImage: `url(${board?.imageFullUrl})`}}>
      <BoardHeader board={board}/>
      <BoardLists />
    </div>
  );
};

export default BoardIdPage;
