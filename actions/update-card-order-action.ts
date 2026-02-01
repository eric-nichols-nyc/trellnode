"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { z } from 'zod';
import { revalidatePath } from "next/cache";

const cardOrder = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
            listId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    ),
    boardId: z.string(),
});

type InputType = z.infer<typeof cardOrder>;
export const updateCardOrder = async (data: InputType) => {
    const { items, boardId } = data;

    const session = await getServerSession(options);

    if (!session || !session.user) {
        redirect("/");
    }
    let user;
    try {
        await connectToDatabase();
        user = await prisma.user.findUnique({
            where: {
                email: session?.user?.email!,
            },
        });
        if (!user) {
            throw new Error("Unable to find user");
        }
    } catch (error) {
        console.log(error);
        throw new Error("Unable to connect to database");
    }

    let cards;

    try {
        const transaction = items.map((card) => {
            return prisma.card.update({
                where: {
                    id: card.id,
                },
                data: {
                    order: card.order,
                    listId: card.listId,
                },
            });
        });
        cards = await prisma.$transaction(transaction);
        revalidatePath(`/board/${boardId}`);
        return { data: cards };
    } catch (error) {
        console.log('UPDATE CARD ERROR: ',error)
        return { message: 'Unable to update card' };
    }
}