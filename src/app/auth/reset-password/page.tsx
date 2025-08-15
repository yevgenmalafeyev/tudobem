import { Suspense } from 'react';
import ResetPasswordClient from '@/components/auth/ResetPasswordClient';
import Logo from '@/components/Logo';

export const dynamic = 'force-dynamic';

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--neo-bg)' }}>
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8" style={{ background: 'var(--neo-card-bg)', border: '1px solid var(--neo-border)' }}>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Logo className="w-16 h-16" />
              </div>
              <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}