"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Board } from "@prisma/client";


const CreateBoard = z.object({
    title: z.string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    }).min(3, {
      message: "Title is too short."
    }),
    image: z.string({
      required_error: "Image is required",
      invalid_type_error: "Image is required",
    }),
});

export async function createBoard({title, image}:any) {
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
    const validationResult = CreateBoard.safeParse({
        title,
        image,
    });

    console.log('isValid ', validationResult);
    if(!validationResult.success){
        return {errors: validationResult.error.flatten().fieldErrors};
    }
  
    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      ] = image.split("|");

      if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
        return {
          error: "Missing fields. Failed to create board."
        };
      }
    
      let board;
    
      try {
        board = await prisma.board.create({
            data: {
                title,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
                userId: user.id,
              }
        });
        revalidatePath('/boards');
        return board;
    } catch (error) {
        console.log(error);
        return {message: 'Unable to create boare'};
    }
}
