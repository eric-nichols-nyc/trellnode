import { notFound } from "next/navigation";
import { getBoardById } from "./_lib/get-board";
import { BoardView } from "./_components/board-view";

type BoardIdPageProps = {
  params: Promise<{ boardId: string }>;
};

const BoardIdPage = async ({ params }: BoardIdPageProps) => {
  const { boardId } = await params;
  const board = await getBoardById(boardId);
  if (!board) {
    notFound();
  }
  return <BoardView board={board} />;
};

export default BoardIdPage;
