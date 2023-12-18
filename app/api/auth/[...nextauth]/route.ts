/**
 * Create auth options
 */

import { prisma } from "@/prisma";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";
import { User } from "next-auth";
const authOptions:AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            console.log(user);
            console.log(account);
            console.log(profile);
            try{
                await connectToDatabase();
                const existinguser = await prisma.user.findUnique({
                    where: {
                        email: user?.email!,
                    },
                });
                if(!existinguser){
                    await prisma.user.create({
                        data: {
                            email: user?.email!,
                            name: user?.name!,
                            image: user?.image!,
                        },
                    });
                }
            }catch(error){
                console.log(error);
                throw new Error("Unable to connect to database");
            }
            return true;
        },
        async redirect({url, baseUrl}) {
            console.log(url);
            console.log(baseUrl);
            return baseUrl;
        },
        async session({session, user}) {
            console.log(session);
            console.log(user);
            return session;
        },
        async jwt({token, user, account, profile}) {
            console.log(token);
            console.log(user);
            console.log(account);
            console.log(profile);
            return token;
        }
    },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
