import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Image from "next/image";
import { User, getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Board } from "@prisma/client";
import { prisma } from "@/prisma";
import { options } from "@/app/api/auth/[...nextauth]/options";

export const BoardListNav = async () => {
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
    <div>
      {boards?.map((board: any) => (
        <Link
          key={board.id}
          href="#"
          className="group flex gap-2 relative h-full w-full border"
        >
          <Image
            alt="placeholder image"
            src={board.imageThumbUrl}
            height={20}
            width={20}
          />
          <span>{board.title}</span>
        </Link>
      ))}
    </div>
  );
};
