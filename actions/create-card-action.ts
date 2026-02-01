"use server";

import { connectToDatabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma  from "@/prisma";
import { revalidatePath } from "next/cache";
/**
 * 1. define a server component
 * 2. create a z.object for validation
 * 3. create and export the create card function
 *  - 1. get a server session with next-auth
 *      - 1. redirect if no session
 *  - 2. connect to the database with try catch
 *  - 3. find user with prisma
 *  - 4. validate the data with zod safeParse
 *  - 5. create the card with prisma
 *  - 6. revalidate the path
 *  - 7. return the card
 **/

const createCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  listId: z.string(),
  boardId: z.string(),
  order: z.number(),
});

type InputType = z.infer<typeof createCardSchema>

const revalidate = true;

export const createCard = async (data: InputType) => {
  // get session
  const session = await getServerSession();
  let user;
  if (!session || !session.user) {
    redirect("/");
  }
  // connect to db
  try {
    await connectToDatabase();
    user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email!,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
  } catch (e) {
    console.log(e);
  }

  // validate data
  const isValid = createCardSchema.safeParse(data);
  if(!isValid.success){
    return {errors: isValid.error.flatten().fieldErrors};
  }
  // create card
  let card;
  try {
    card = await prisma.card.create({
      data: {
        title: data.title,
        order: data.order,
        listId: data.listId,
      },
    });
    revalidatePath(`/boards/${data.boardId}`)
    return card;
  }catch(e){
    return {message: 'Unable to create card'}
  }
};
