import BoardHeader from "./_components/board-header";
import { prisma } from "@/prisma";
import { Board, User } from "@prisma/client";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { BoardDndLists } from "./_components/board-lists";
import { Sidenav } from "../../_components/sidenav";

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
  if (!board) {
    return <p>Sorry not found</p>;
  }

  return (
    <div
      className="flex flex-row relative overflow-y-auto flex-1 bg-cover bg-center"
      style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
    >
      <Sidenav />
      <div className="flex flex-col overflow-y-auto flex-1">
        <div className="grow relative overflow-y-auto">
          <BoardHeader board={board} />
          <BoardDndLists board={board} />
        </div>
      </div>
    </div>
  );
};

export default BoardIdPage;
