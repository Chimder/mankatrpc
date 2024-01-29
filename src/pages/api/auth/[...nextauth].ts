import { db } from "@/shared/utils/db";
import { trpc } from "@/shared/utils/trpc";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      const isUser = await db.user.findUnique({
        where: {
          email: user?.email,
        },
      });

      if (!isUser) {
        console.log("No User REggggg");
        await db.user.create({ data: user });
      } else {
        console.log("already created");
      }

      return true;
    },
  },
};
export default NextAuth(authOptions);
