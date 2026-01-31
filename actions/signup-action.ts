"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/prisma";
import { connectToDatabase } from "@/lib/db";

export async function signUp(email: string, password: string, name: string) {
  if (!email?.trim() || !password?.trim() || !name?.trim()) {
    return { error: "Email, password, and name are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  try {
    await connectToDatabase();
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return { error: "An account with this email already exists." };
    }
    const hashedPassword = await hash(password, 12);
    await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        hashedPassword,
      },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}
