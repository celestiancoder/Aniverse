// auth.ts
import NextAuth, { CredentialsSignin, NextAuthConfig, Session, DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import { User } from "./models/User"
import { compare } from "bcryptjs"
import Github from "next-auth/providers/github"

// Extend the built-in session type
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"]
  }

  // Extend the built-in User type
  interface User {
    role?: string;
    Name?: string;
  }
}

// Add custom properties to JWT
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        
        if (!email || !password) {
          throw new CredentialsSignin('Please provide both email and password')
        }
        
        await connectDB();
        
        const user = await User.findOne({ email }).select("+password +role");
        if (!user) {
          throw new Error("Invalid email and password")
        }
        
        if (!user.password) {
          throw new Error("invalid password")
        }
        
        const isMatched = await compare(password, user.password);
        if (!isMatched) {
          throw new Error("password did not match")
        }
        
        return {
          id: user.id,
          email: user.email,
          Name: user.Name,
          role: user.role
        };
      }
    })
  ],
  
  pages: {
    signIn: "/login"
  },
  
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    
    async signIn({ account }) {
      if (account?.provider === 'credentials') {
        return true;
      } else {
        return false;
      }
    }
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);