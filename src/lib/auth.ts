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
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        console.log('🔐 Sign-in callback triggered:', {
          provider: account?.provider,
          type: account?.type,
          user: user?.email,
          timestamp: new Date().toISOString()
        });

        if (account?.provider === 'google') {
          console.log('🔍 Google OAuth sign-in details:', { 
            user: {
              id: user?.id,
              name: user?.name,
              email: user?.email,
              image: user?.image
            },
            account: {
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token ? 'present' : 'missing',
              id_token: account.id_token ? 'present' : 'missing',
              scope: account.scope,
              token_type: account.token_type,
              expires_at: account.expires_at
            },
            profile: profile ? {
              sub: (profile as any)?.sub,
              name: (profile as any)?.name,
              email: (profile as any)?.email,
              picture: (profile as any)?.picture,
              email_verified: (profile as any)?.email_verified
            } : 'not provided'
          });

          // Validate that we have the required user information
          if (!user?.email) {
            console.error('❌ Google OAuth failed: No email provided');
            return false;
          }

          if (!user?.name) {
            console.warn('⚠️ Google OAuth warning: No name provided, using email');
            user.name = user.email;
          }

          // Sync OAuth user with our user database
          try {
            const { UserDatabase } = await import('@/lib/userDatabase');
            
            console.log('🔄 Syncing Google OAuth user with database');
            
            // Check if user exists in our system
            const existingUser = await UserDatabase.findUserByEmail(user.email);
            
            if (!existingUser) {
              console.log('👤 Creating new OAuth user in database');
              // Create new user with OAuth provider
              const newUser = await UserDatabase.registerUser(
                user.name, // Use name as username
                'oauth-password-placeholder', // OAuth users don't have passwords
                user.email,
                false, // email marketing consent defaults to false
                'google' // OAuth provider
              );
              console.log('✅ OAuth user created successfully:', { id: newUser.id, email: newUser.email });
            } else {
              console.log('👤 OAuth user already exists in database:', { id: existingUser.id, email: existingUser.email });
              
              // Update OAuth provider if it's missing
              if (!existingUser.oauth_provider) {
                console.log('🔄 Updating existing user with OAuth provider');
                // Add OAuth provider to existing user (this would need a new method)
                // For now, we'll just log it
                console.log('📝 TODO: Update existing user with oauth_provider = "google"');
              }
            }
            
            console.log('✅ Google OAuth database sync completed successfully');
          } catch (dbError) {
            console.error('❌ Failed to sync OAuth user with database:', dbError);
            // Don't fail the OAuth login because of database sync issues
            // The user can still be authenticated via NextAuth's session
            console.log('⚠️ Continuing with OAuth login despite database sync failure');
          }

          console.log('✅ Google OAuth validation passed');
          return true;
        }

        // For other providers (email/password)
        return true;
      } catch (error) {
        console.error('❌ Sign-in callback error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      try {
        console.log('🎫 JWT callback triggered:', {
          hasToken: !!token,
          hasUser: !!user,
          hasAccount: !!account,
          provider: account?.provider,
          timestamp: new Date().toISOString()
        });

        // First time sign in
        if (account && user) {
          console.log('🆕 First-time sign-in, adding user to token');
          token.provider = account.provider;
          token.userId = user.id;
        }

        return token;
      } catch (error) {
        console.error('❌ JWT callback error:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        console.log('📱 Session callback triggered:', {
          hasSession: !!session,
          hasToken: !!token,
          userEmail: session?.user?.email,
          provider: (token as any)?.provider,
          timestamp: new Date().toISOString()
        });

        if (token) {
          session.provider = (token as any).provider;
          session.userId = (token as any).userId;
        }

        return session;
      } catch (error) {
        console.error('❌ Session callback error:', error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      try {
        console.log('🔀 Redirect callback triggered:', { url, baseUrl });
        
        // Ensure we redirect to the correct base URL
        if (url.startsWith("/")) {
          const redirectUrl = `${baseUrl}${url}`;
          console.log('✅ Redirecting to relative path:', redirectUrl);
          return redirectUrl;
        }
        
        if (new URL(url).origin === baseUrl) {
          console.log('✅ Redirecting to same origin:', url);
          return url;
        }
        
        console.log('✅ Redirecting to base URL:', baseUrl);
        return baseUrl;
      } catch (error) {
        console.error('❌ Redirect callback error:', error);
        return baseUrl;
      }
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);