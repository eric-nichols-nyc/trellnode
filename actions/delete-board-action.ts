"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export async function deleteBoard(id:string) {
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

    const board = await prisma.board.findUnique({
        where: {
            id,
        },
    });

    if (!board) {
        throw new Error("Unable to find board");
    }

    if (board.userId !== user.id) {
        throw new Error("You do not have permission to delete this board");
    }

    await prisma.board.delete({
        where: {
            id,
        },
    });

    return {
        success: true,
    };
}