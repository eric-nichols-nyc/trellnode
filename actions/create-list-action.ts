"use server";

import { connectToDatabase } from "@/lib/db";
import prisma  from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const CreateList = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short",
  }),
  boardId: z.string(),
  order: z.number(),
});

export async function createList({title, boardId, order}:any) {
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

    // validate input
    const validationResult = CreateList.safeParse({
        title,
        boardId,
        order
    });

    if(!validationResult.success){
        return {errors: validationResult.error.flatten().fieldErrors};
    }
  
    
      let list;
    
      try {
        list = await prisma.list.create({
            data: {
                title,
                boardId,
                order,
              }
        });
        revalidatePath(`/boards/${boardId}`);
        return list;
    } catch (error) {
        return {message: 'Unable to create list'};
    }
}
