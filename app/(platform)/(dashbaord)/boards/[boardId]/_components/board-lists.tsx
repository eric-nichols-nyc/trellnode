import { AddListForm } from "./add-list-form";
import { BoardListItem } from "./board-list-item";

type BoardListsProps = {
  boardId: string;
};
export const BoardLists = () => {
  return (
    <div className="pt-20 border h-full">
      <div className="gap-3 h-full">
        <div className="h-full overflow-x-auto p-4 ">
          <ol className="flex gap-x-3 h-full">
            {[...Array(5)].map((_, i) => (
              <li key={i}>
                <BoardListItem />
              </li>
            ))}
            <AddListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        </div>
      </div>
    </div>
  );
};
