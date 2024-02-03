import { Board } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type NavSearchBarFormProps = {
  board: Board;
};
export const NavsearchItem = ({ board }: NavSearchBarFormProps) => {
  return (
    <Link href={`/boards/${board.id}`} className="cursor-pointer flex gap-1 bg-slate-200 w-full">
      <Image src={board.imageThumbUrl} alt="board" width={32} height={32} />
      <div>{board.title}</div>
    </Link>
  );
};
