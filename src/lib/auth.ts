import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { Pool } from 'pg'
import PostgresAdapter from "@auth/pg-adapter"

// Check if OAuth credentials are properly configured (not placeholder values)
const isValidGoogleConfig = process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET && 
  !process.env.GOOGLE_CLIENT_ID.includes('your-google-client-id') &&
  !process.env.GOOGLE_CLIENT_SECRET.includes('your-google-client-secret');

// Create PostgreSQL connection pool for NextAuth adapter
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const authOptions = {
  adapter: PostgresAdapter(pool),
  providers: [
    ...(isValidGoogleConfig ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),
  ],
  session: {
    strategy: "database" as const, // Use database strategy with adapter
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 7 * 24 * 60 * 60, // 7 days (auto-renewal trigger)
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);