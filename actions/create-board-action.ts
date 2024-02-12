"use server";

import { connectToDatabase } from "@/lib/db";
import { prisma } from "@/prisma";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";


const CreateBoard = z.object({
  title: z.string({
    required_error: "Title is required",
    invalid_type_error: "Title is required",
  }).min(3, {
    message: "Title is too short."
  }),
  imageId: z.string().min(1),
  imageThumbUrl: z.string().min(1),
  imageFullUrl: z.string().min(1),
  imageLinkHTML: z.string().min(1),
  imageUserName: z.string().min(1),
});

type Data = {
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageLinkHTML: string;
  imageUserName: string;
  imagePrimaryColor?: string;
  imageSecondaryColor?: string;
};

export async function createBoard({title, imageId,
  imageThumbUrl,
  imageFullUrl,
  imageLinkHTML,
  imagePrimaryColor,
  imageSecondaryColor,
  imageUserName}:Data) {

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
    throw new Error("Unable to connect to database");
  }


  // validate input
  const validationResult = CreateBoard.safeParse({
    title,
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName
  });

  if (!validationResult.success) {
    return { errors: validationResult.error.flatten().fieldErrors };
  }



  if (!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML) {
    return {
      error: "Missing fields. Failed to create board."
    };
  }

  let board;

  console.log(imagePrimaryColor, imageSecondaryColor)

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
        imagePrimaryColor,
        imageSecondaryColor,
      }
    });
    revalidatePath('/boards');
    return board;
  } catch (error) {
    console.error(error);
    return { message: 'Unable to create board' };
  }
}
