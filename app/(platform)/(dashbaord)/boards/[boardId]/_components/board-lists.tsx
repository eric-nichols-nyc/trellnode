import { Board } from "@prisma/client";
import { AddListForm } from "./add-list-form";
import { BoardList } from "./board-list-item";
import { prisma } from "@/prisma";
import { connectToDatabase } from "@/lib/db";
import { ListWithCards } from "@/types";
import BoardDnD from "./board-list-dnd";

type BoardListsProps = {
  board: Board;
};

async function getBoardLists(boardId: string) {
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

export const BoardLists = async ({ board }: BoardListsProps) => {
  const lists = await getBoardLists(board.id);
  console.log("lists ===== ", lists);
  // create catch for lists errors
  return (
    <div className="pt-20 border h-full">
      <div className="gap-3 h-full">
        <div className="h-full overflow-x-auto p-4 ">
          <BoardDnD lists={lists} boardId={board.id} />
        </div>
      </div>
    </div>
  );
};
