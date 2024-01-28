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
      // const check = userControllerRegNewUser(user);
      const check = await trpc.user.checkOrCreateUser.useMutation(user);
      // console.log(check.then((e) => console.log));
      // console.log(check.data?.statusCode);
      return true;
    },
  },
};
export default NextAuth(authOptions);
