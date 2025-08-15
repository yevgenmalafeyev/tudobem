import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { Pool } from 'pg'
import PostgresAdapter from "@auth/pg-adapter"
import { UserDatabase } from './userDatabase'

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
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account }: any) {
      try {
        if (account?.provider === 'google') {
          console.log('🚀 OAuth sign-in attempt:', { 
            email: user.email, 
            name: user.name, 
            provider: account.provider 
          });
          
          // Create or link user in custom users table
          const customUser = await UserDatabase.createOrLinkOAuthUser({
            email: user.email,
            name: user.name || user.email,
            provider: account.provider,
            providerId: account.providerAccountId,
            image: user.image
          });
          
          if (!customUser) {
            console.error('❌ Failed to create/link custom user for OAuth');
            return false;
          }
          
          console.log('✅ OAuth user successfully integrated with custom system');
          return true;
        }
        return true;
      } catch (error) {
        console.error('❌ Error in OAuth signIn callback:', error);
        return false;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account }: any) {
      try {
        if (account && user) {
          token.provider = account.provider;
          token.userId = user.id;
          
          // Get custom user data for OAuth users
          if (account.provider === 'google') {
            const customUser = await UserDatabase.getUserByEmail(user.email);
            if (customUser) {
              token.customUserId = customUser.id;
              token.customUsername = customUser.username;
            }
          }
        }
        return token;
      } catch (error) {
        console.error('❌ Error in JWT callback:', error);
        return token;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      try {
        if (token) {
          Object.assign(session, {
            provider: token.provider,
            userId: token.userId,
            customUserId: token.customUserId,
            customUsername: token.customUsername
          });
          
          // Get user configuration for OAuth users
          if (token.customUserId && token.provider === 'google') {
            try {
              const userConfig = await UserDatabase.getUserConfiguration(token.customUserId);
              session.userConfig = userConfig;
            } catch (error) {
              console.warn('Could not load user config for OAuth user:', error);
            }
          }
        }
        return session;
      } catch (error) {
        console.error('❌ Error in session callback:', error);
        return session;
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);