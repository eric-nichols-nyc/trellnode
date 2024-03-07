"use server";

import { connectToDatabase } from "@/lib/db";
import prisma  from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

const DeleteList = z.object({
  id: z.string(),
  boardId: z.string(),
});

type InputType = z.infer<typeof DeleteList>;

export async function deleteList(data:InputType) {
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
    const { id, boardId } = data;

    let list;

  try{
    list = await prisma.list.delete({
        where:{
            id, 
            boardId
        }
    })
    revalidatePath(`/boards/${boardId}`, 'page');
    return {success: true}
  }catch(error){
    console.log('ERROR:', error)
    return {message: 'Unable to delete list'}
  }
}