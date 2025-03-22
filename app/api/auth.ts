import NextAuth, { NextAuthOptions, DefaultSession, Session, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "@/app/api/db";
import { User as UserModel } from "./models/User"; // Renamed to avoid conflict with the User type
import { compare } from "bcryptjs";
import Github from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

// Define the User type
interface CustomUser extends User {
  id: string;
  email: string;
  Name: string;
  role: string;
  image: string | null;
  name: string | null;
  password?: string; // Optional because it's not always selected
}

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      role?: string;
      image?: string | null;
      name?: string | null;
    } & DefaultSession["user"];
  }

  // Extend the built-in User type
  interface User {
    role?: string;
    Name?: string;
    image?: string | null;
    name?: string | null;
  }
}

// Add custom properties to JWT
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    image?: string | null;
    name?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Please provide both email and password");
        }

        await connectDB();

        const user = await UserModel.findOne({ email }).select("+password +role");
        if (!user) {
          throw new Error("Invalid email and password");
        }

        if (!user.password) {
          throw new Error("Invalid password");
        }

        const isMatched = await compare(password, user.password);
        if (!isMatched) {
          throw new Error("Password did not match");
        }

        return {
          id: user.id,
          email: user.email,
          Name: user.Name,
          role: user.role,
          image: user.image || null,
          name: user.name || null,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string | undefined; // Explicitly type `role`
        session.user.image = token.image as string | null | undefined; // Explicitly type `image`
        session.user.name = token.name as string | null | undefined; // Explicitly type `name`
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Check if the user is of type CustomUser
        const customUser = user as CustomUser;
        token.role = customUser.role as string | undefined; // Explicitly type `role`
        token.image = customUser.image as string | null | undefined; // Explicitly type `image`
        token.name = customUser.name as string | null | undefined; // Explicitly type `name`
      }
      return token;
    },

    async signIn({ account }) {
      if (account?.provider === 'credentials') {
        return true;
      } else {
        return false;
      }
    },
  },
};

// Initialize NextAuth and get the handlers and utilities
const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// Export GET and POST handlers for the API route
export const { GET, POST } = handlers;

// Export signIn and signOut for use in components
export { signIn, signOut, auth };