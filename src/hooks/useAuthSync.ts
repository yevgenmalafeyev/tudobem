'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';

/**
 * Hook to synchronize authentication state between NextAuth and the app store
 * Handles:
 * - Setting authentication state in store when session changes
 * - Loading user profile configuration when logging in
 * - Preserving guest preferences when switching between auth states
 */
export function useAuthSync() {
  const { data: session, status } = useSession();
  const { 
    isAuthenticated, 
    setAuthenticated, 
    setProfileConfiguration, 
    restoreGuestPreferences 
  } = useStore();

  useEffect(() => {
    if (status === 'loading') {
      // Still loading session, don't do anything yet
      return;
    }

    const isSessionAuthenticated = status === 'authenticated' && !!session?.user;
    
    if (isSessionAuthenticated !== isAuthenticated) {
      console.log('🔄 Auth state change:', { 
        from: isAuthenticated, 
        to: isSessionAuthenticated,
        user: session?.user?.email 
      });
      
      if (isSessionAuthenticated) {
        // User just logged in
        setAuthenticated(true);
        
        // TODO: Here you would typically fetch user profile configuration from API
        // For now, we'll use a mock profile or keep current settings
        console.log('📥 User logged in, keeping current configuration');
        
        // If you want to load user profile from database:
        // fetchUserProfile(session.user.id).then(profileConfig => {
        //   setProfileConfiguration(profileConfig);
        // });
        
      } else {
        // User just logged out
        console.log('📤 User logged out, restoring guest preferences');
        restoreGuestPreferences();
      }
    }
  }, [session, status, isAuthenticated, setAuthenticated, setProfileConfiguration, restoreGuestPreferences]);

  return { session, status, isAuthenticated };
}