
import { prisma } from "@/prisma";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db";

export const options:AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({user, account, profile}) {
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
                return true;
            }catch(error){
                console.log(error);
                throw new Error("Unable to connect to database");
            }
        },
        async redirect({url, baseUrl}) {
            // console.log(url);
            // console.log(baseUrl);
            return baseUrl;
        },
        async jwt({token, user, account, profile}) {
            // console.log('profile ',profile)
            if (user) {
            // console.log('user id = ', user)
            return {
                ...token,
                id: user.id,
            }
          }
          return token
        },
        async session({session, token, user}) {
            // console.log(session);
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                }
            }
        },
    },
}