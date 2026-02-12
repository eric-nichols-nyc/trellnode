import { Board } from "@prisma/client";
import { prisma } from "@/prisma";
import { connectToDatabase } from "@/lib/db";
import {BoardDnD} from "../boarddndcontainer/board-dnd-container";

type BoardDndListsProps = {
  board: Board;
};

async function getBoardDndLists(boardId: string) {
  // get board lists
  try {
    await connectToDatabase();
    const lists = await prisma.list.findMany({
      where: {
        boardId,
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
    return lists;
  } catch (e) {
    console.log(e);
  }
}

export const BoardDndLists = async ({ board }: BoardDndListsProps) => {
  const lists = await getBoardDndLists(board.id);
  // create catch for lists errors
  return (
    <div className="pt-14 h-full min-h-0">
      <div className="flex gap-3 h-full min-h-0">
        <div className="h-full min-h-0 overflow-x-auto overflow-y-hidden p-4">
          {
            lists && (  <BoardDnD lists={lists} boardId={board.id} />)
          }
        </div>
      </div>
    </div>
  );
};
