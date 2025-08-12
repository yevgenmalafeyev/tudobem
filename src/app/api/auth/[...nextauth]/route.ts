import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import AppleProvider from "next-auth/providers/apple"
import { UserDatabase } from "@/lib/userDatabase"
// import PostgresAdapter from "@auth/pg-adapter"
// import { Pool } from "pg"

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// })

const handler = NextAuth({
  // adapter: PostgresAdapter(pool), // Commented out for testing
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      })
    ] : []),
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET ? [
      AppleProvider({
        clientId: process.env.APPLE_ID,
        clientSecret: process.env.APPLE_SECRET,
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client from token
      if (session.user && token.id) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).user.id = token.id
      }
      return session
    },
    async jwt({ token, user }) {
      // Persist user ID to token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async signIn({ user, account }) {
      try {
        // For OAuth providers, automatically create user in our database
        if (account?.provider && account.provider !== 'credentials') {
          if (!user.email || !user.name) {
            console.error('OAuth user missing required information:', user);
            return false;
          }

          // Check if user already exists by email
          const existingUser = await UserDatabase.findUserByEmail(user.email);
          
          if (!existingUser) {
            // Create new user with OAuth data
            console.log(`Creating new OAuth user from ${account.provider}:`, { name: user.name, email: user.email });
            
            // Generate a secure random password for OAuth users (they won't use it)
            const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12);
            
            const newUser = await UserDatabase.registerUser(
              user.name,
              randomPassword, 
              user.email,
              false, // OAuth users didn't explicitly consent to marketing emails
              account.provider // Store which OAuth provider was used
            );
            
            console.log(`OAuth user created and activated:`, newUser.id);
          } else {
            console.log(`OAuth user already exists:`, existingUser.id);
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt", // Use JWT strategy since we're not using database adapter
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 7 * 24 * 60 * 60, // 7 days (auto-renewal trigger)
  },
  pages: {
    signIn: '/auth/signin',
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },
})

export { handler as GET, handler as POST }