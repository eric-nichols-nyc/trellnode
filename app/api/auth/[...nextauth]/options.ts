import { prisma } from "@/prisma";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { compare } from "bcryptjs";
import { createDefaultBoardForUser } from "@/lib/create-default-board";

export const options: AuthOptions = {
    pages: {
        signIn: "/signin",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                await connectToDatabase();
                const email = credentials.email.trim().toLowerCase();
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                if (!user?.hashedPassword) return null;
                const ok = await compare(credentials.password, user.hashedPassword);
                if (!ok) return null;
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "credentials") return true;
            if (!user?.email) return false;
            try {
                await connectToDatabase();
                const email = user.email.trim().toLowerCase();
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });
                if (!existingUser) {
                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            name: user.name ?? email.split("@")[0],
                            image: user.image ?? null,
                        },
                    });
                    await createDefaultBoardForUser(newUser.id);
                }
                return true;
            } catch (error) {
                console.error("NextAuth signIn callback:", error);
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return url;
            if (url.startsWith(baseUrl)) return url;
            return baseUrl;
        },
        async jwt({ token, user, account, profile }) {
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
        async session({ session, token, user }) {
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