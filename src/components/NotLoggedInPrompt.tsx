'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';

interface NotLoggedInPromptProps {
  className?: string;
}

export default function NotLoggedInPrompt({ className = '' }: NotLoggedInPromptProps) {
  const { configuration } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          setIsLoggedIn(result.authenticated);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Don't show if loading or if user is logged in
  if (isLoggedIn === null || isLoggedIn) {
    return null;
  }

  const content = configuration.appLanguage === 'pt' ? {
    text: 'Você não está logado.',
    action: 'Cadastre-se para aproveitar todas as vantagens - só leva 1 minuto e é gratuito!',
    linkText: 'Criar conta grátis'
  } : {
    text: 'You\'re not logged in.',
    action: 'Sign up to enjoy all advantages - it only takes 1 minute and is free!',
    linkText: 'Create free account'
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="inline-flex items-center gap-2 text-sm" style={{ color: 'var(--neo-text-muted)' }}>
        <span>ℹ️ {content.text}</span>
        <Link 
          href="/?auth=signup" 
          className="underline hover:no-underline transition-all"
          style={{ color: 'var(--neo-accent)' }}
        >
          {content.action}
        </Link>
      </div>
    </div>
  );
}