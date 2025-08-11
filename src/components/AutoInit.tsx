'use client';

import { useEffect, useState } from 'react';

export default function AutoInit() {
  const [initStatus, setInitStatus] = useState<'idle' | 'checking' | 'initializing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<{
    totalExercises: number;
    byLevel: {
      A1: number;
      A2: number;
      B1: number;
      B2: number;
      C1: number;
      C2: number;
    };
  } | null>(null);

  useEffect(() => {
    // Only run auto-init in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Check if we should auto-init (only on first load)
    const hasAutoInitialized = localStorage.getItem('auto-init-completed');
    if (hasAutoInitialized) {
      return;
    }

    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setInitStatus('checking');
      setMessage('Checking database status...');

      const response = await fetch('/api/auto-init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setInitStatus('success');
        setMessage(data.message);
        setStats(data.stats);
        localStorage.setItem('auto-init-completed', 'true');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          setInitStatus('idle');
        }, 10000);
      } else {
        setInitStatus('error');
        setMessage(data.error || 'Initialization failed');
      }
    } catch (error) {
      console.error('Auto-init error:', error);
      setInitStatus('error');
      setMessage('Failed to initialize database');
    }
  };

  if (initStatus === 'idle') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`neo-card p-4 shadow-lg ${
        initStatus === 'success' ? 'bg-green-50 border-green-200' :
        initStatus === 'error' ? 'bg-red-50 border-red-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {initStatus === 'checking' || initStatus === 'initializing' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : initStatus === 'success' ? (
              <div className="text-green-600">✅</div>
            ) : (
              <div className="text-red-600">❌</div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              Database Initialization
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {message}
            </p>
            
            {stats && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Total exercises: <strong>{stats.totalExercises}</strong></p>
                <p>By level: A1:{stats.byLevel.A1}, A2:{stats.byLevel.A2}, B1:{stats.byLevel.B1}, B2:{stats.byLevel.B2}, C1:{stats.byLevel.C1}, C2:{stats.byLevel.C2}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setInitStatus('idle')}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}