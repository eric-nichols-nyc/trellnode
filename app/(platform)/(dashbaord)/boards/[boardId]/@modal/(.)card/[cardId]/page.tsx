import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect, notFound } from "next/navigation";
import { CardModal } from "../../../_components/card-modal";

type PageProps = {
  params: Promise<{ cardId: string }>;
};

async function getCard(cardId: string) {
  const session = await getServerSession(options);
  if (!session?.user?.email) {
    redirect("/");
  }

  try {
    await connectToDatabase();
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { list: { select: { boardId: true } } },
    });
    return card;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export default async function CardModalPage({ params }: PageProps) {
  const { cardId } = await params;
  const card = await getCard(cardId);
  if (!card) notFound();

  return <CardModal card={card} />;
}
