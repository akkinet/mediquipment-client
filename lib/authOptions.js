import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: String(process.env.TWITTER_CLIENT_ID),
      clientSecret: String(process.env.TWITTER_CLIENT_SECRET),
      version: "2.0",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (!user?.error) {
          return user;
        }
        return null;
      },
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account, user }) {
      // console.log("user and account" , user , account);
      if (account) {
        token.provider = account.provider; // Add provider info to the token
      }
      if (user && user.fullName) token.name = user.fullName;
      if (user && user?.image) token.picture = user.image;
      if (user) token.username = user.username;

      return token;
    },
    async session({ session, token, user }) {
      // console.log(" under auth optins session and token"  ,session, token);
      if (token.provider == "credentials") {
        if (token.name) session.user.name = token.name;
        if (token.username) session.user.username = token.username;
        if (token?.image)
          session.user.image = token.picture;
      }
      session.provider = token.provider; // Include provider in the session object
      return session;
    },
  },
};
