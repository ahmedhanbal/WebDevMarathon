import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";  // Import JWT type directly
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/lib/data/user";

// Define UserRole type matching our schema
export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

// Extend the session type
declare module "next-auth" {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: UserRole;
    }
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
  }
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        });
      }
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth sign-in without email verification
      if (account?.provider !== "credentials") {
        // Set default role for new users from OAuth
        try {
          if (user.id) {
            const dbUser = await getUserById(user.id);
            if (dbUser && !dbUser.role) {
              await db.user.update({
                where: { id: user.id },
                data: { role: "STUDENT" }
              });
            }
          }
        } catch (error) {
          console.error("Error updating user role:", error);
        }
        
        return true;
      }

      // For credentials, ensure verification was done
      if (user.id) {
        const existingUser = await getUserById(user.id);
        if (!existingUser?.emailVerified) return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role as UserRole;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
