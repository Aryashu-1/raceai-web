import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        authorize: async (credentials) => {
          // This is where you connect to your existing backend validation
          // For now, we mock the success if the existing backend API was checking it
          // OR we implement the check here against your DB
          
          if (!credentials?.email || !credentials?.password) return null;

          try {
             // Example: Call your own backend to verify
             // const res = await fetch("http://localhost:5001/auth/signin", ...)
             
             // MOCK implementation for 'production ready' structure without live backend:
             // In real production, replace this with actual DB call.
             const user = { 
                 id: "1", 
                 name: "User", 
                 email: credentials.email as string,
                 role: "user" 
             }
             return user;
          } catch (e) {
              return null;
          }
        }
    })
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign in page
    error: "/auth/error", 
  },
  callbacks: {
      async session({ session, token }) {
          if (session.user && token.sub) {
              session.user.id = token.sub;
          }
          return session;
      }
  }
})
