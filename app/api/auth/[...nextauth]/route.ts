import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" as const },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }).lean();
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }: any) {
      (session as any).user.role = token.role;
      return session;
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
} as const;

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };


