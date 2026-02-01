"use server";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import { z } from 'zod';
import { revalidatePath } from "next/cache";

const UpdateListOrder = z.object({
    items: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            order: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
        }),
    ),
    boardId: z.string(),
});

type InputType = z.infer<typeof UpdateListOrder>;
export const updateListOrder = async (data: InputType) => {
    const { items, boardId } = data;

    const session = await getServerSession();

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

    let lists;

    try {
        const transaction = items.map((item) => {
            return prisma.list.update({
                where: {
                    id: item.id,
                },
                data: {
                    order: item.order,
                },
            });
        });
        lists = await prisma.$transaction(transaction);
        revalidatePath(`/board/${boardId}`);
        return { data: lists };
    } catch (error) {
        return { message: 'Unable to update list' };
    }
}