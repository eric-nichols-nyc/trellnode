import { Board } from "@prisma/client";
import prisma  from "@/prisma";
import { connectToDatabase } from "@/lib/db";
import {BoardDnD} from "./board-dnd-container";

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
    <div className="pt-20 h-full">
      <div className="gap-3 h-full">
        <div className="h-full overflow-x-auto p-4 ">
          {
            lists && (  <BoardDnD lists={lists} boardId={board.id} />)
          }
        </div>
      </div>
    </div>
  );
};
