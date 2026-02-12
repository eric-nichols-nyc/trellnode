import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { AllBoardsList } from "../_components/board-list";
import { User, Board } from "@prisma/client";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Logo } from "@/components/shared/logo";
import { BoardListNav } from "../_components/board-list-nav";
import { Sidenav } from "../_components/sidenav";

const Boardspage = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }
  let user: User | null = null;
  let boards: Board[] | null = null;

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
    boards = await prisma.board.findMany({
      where: {
        userId: user?.id!,
      },
    });
  } catch (e) {
    console.log(e);
  }

  return (
    <div className="boards-page-container w-full flex justify-center">
      <div className="all-boards flex flex-col w-full max-w-4xl">
        <div className="flex items-center justify-center font-semibold h-[124px]">
          <div className="w-full px-3 flex gap-2 items-center">
            <Logo />
            <div>Trellnode workspace</div>
          </div>
        </div>
        <hr />

        <AllBoardsList boards={boards} />
      </div>
    </div>
  );
};

export default Boardspage;
