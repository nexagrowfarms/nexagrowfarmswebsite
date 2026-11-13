import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";
import { connectDB } from "@/lib/db";
// import User, { IUser } from "../models/User";
import User, { IUser } from "./User";

import bcrypt from "bcryptjs";

// Extend the Session type to include the id property
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Yahoo OAuth2 profile (OpenID Connect userinfo response)
interface YahooProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

// Custom Yahoo provider for NextAuth
// Yahoo requires HTTP Basic Auth at token endpoint; NextAuth default sends credentials in body.
function YahooProvider(options: OAuthUserConfig<YahooProfile>): OAuthConfig<YahooProfile> {
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/yahoo`;
  return {
    id: "yahoo",
    name: "Yahoo",
    type: "oauth",

    authorization: {
      url: "https://api.login.yahoo.com/oauth2/request_auth",
      params: {
        scope: "openid email",
        redirect_uri: redirectUri,
      },
    },

    token: {
      url: "https://api.login.yahoo.com/oauth2/get_token",
      async request({ params }) {
        const clientId = process.env.YAHOO_CLIENT_ID ?? "";
        const clientSecret = process.env.YAHOO_CLIENT_SECRET ?? "";
        const response = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: (params.code as string) ?? "",
            redirect_uri: redirectUri,
          }),
        });
        const tokens = await response.json();
        if (!response.ok) {
          throw new Error(JSON.stringify(tokens));
        }
        return { tokens };
      },
    },

    userinfo: "https://api.login.yahoo.com/openid/v1/userinfo",

    profile(profile: YahooProfile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.given_name ?? profile.email ?? null,
        email: profile.email ?? null,
        image: profile.picture ?? null,
      };
    },

    ...options,
  };
}
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
    YahooProvider({
      clientId: process.env.YAHOO_CLIENT_ID!,
      clientSecret: process.env.YAHOO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] authorize called", { email: credentials?.email ? "***" : undefined });
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing email or password");
          return null;
        }
        try {
          await connectDB();
          const user = await User.findOne({
            email: credentials.email.toLowerCase().trim(),
            provider: "credentials",
          }).lean<IUser | null>();
          if (!user) {
            console.log("[Auth] No user found for email");
            return null;
          }
          if (!user?.password) {
            console.log("[Auth] User has no password (OAuth-only account?)");
            return null;
          }
          const ok = await bcrypt.compare(credentials.password, user.password);
          if (!ok) {
            console.log("[Auth] Password mismatch");
            return null;
          }
          console.log("[Auth] Credentials valid, returning user id:", user._id);
          return {
            id: String(user._id),
            email: user.email,
            name: user.name ?? user.email,
            image: user.image ?? null,
          };
        } catch (err) {
          console.error("[Auth] authorize error", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) token.id = user.id;
      if (account?.provider === "credentials" && user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token.sub ?? token.id) as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
