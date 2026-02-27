import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { family: true },
        });
        session.user.familyId = dbUser?.familyId ?? undefined;
        session.user.familyName = dbUser?.family?.name ?? undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  events: {
    async signIn({ user }) {
      // Auto-accept pending invitations for this email
      if (!user.email) return;
      const invitation = await prisma.invitation.findFirst({
        where: { email: user.email, accepted: false },
      });
      if (invitation) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { familyId: invitation.familyId },
          }),
          prisma.invitation.update({
            where: { id: invitation.id },
            data: { accepted: true },
          }),
        ]);
      }
    },
  },
};
