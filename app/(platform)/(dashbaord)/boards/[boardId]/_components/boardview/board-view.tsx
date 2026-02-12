import { Board } from "@prisma/client";
import BoardHeader from "../board-header";
import { BoardDndLists } from "../board-lists";

type BoardViewProps = {
  board: Board;
};

export function BoardView({ board }: BoardViewProps) {
  const getPrimaryColor = () => {
    if (board?.imagePrimaryColor) return board.imagePrimaryColor;
    return "rgb(229 229 229);";
  };

  const getTheme = () => {
    if (board?.backgroundBrightness === "light") return "light";
    return "dark";
  };

  const theme = getTheme();

  return (
    <div
      data-theme={theme}
      className="flex flex-row relative overflow-hidden flex-1 min-h-0 w-full h-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: board?.imageFullUrl ? `url(${board.imageFullUrl})` : undefined,
        color: theme === "light" ? "black" : "white",
      }}
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <BoardHeader board={board} />
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
          <BoardDndLists board={board} />
        </div>
      </div>
    </div>
  );
}
