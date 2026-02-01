"use server";

import { connectToDatabase } from "@/lib/db";
import prisma  from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const UpdateBoard = z.object({
    title: z.string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    }).min(3, {
      message: "Title is too short."
    })
});

export async function updateBoard(data:any) {
    const session = await getServerSession(options);
    const { title, id } = data;

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
    const validationResult = UpdateBoard.safeParse({
        title,
    });

    if(!validationResult.success){
        return {errors: validationResult.error.flatten().fieldErrors};
    }
  
      let board;
    
      try {
        board = await prisma.board.update({
          where: {
            id,
          },
          data: {
            title,
          },
        });
        revalidatePath('/boards');
        return board;
    } catch (error) {
        return {message: 'Unable to update boare'};
    }
}
