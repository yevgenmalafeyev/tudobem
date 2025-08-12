'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { t } from '@/utils/translations';
import { ProgressStats } from '@/lib/userDatabase';

interface UserProfileProps {
  onBack?: () => void;
}

interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  last_login?: string;
  email_verified?: boolean;
}

export default function UserProfile({ onBack }: UserProfileProps) {
  const { configuration } = useStore();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get user progress data
      const progressResponse = await fetch('/api/progress/stats', {
        method: 'GET',
        credentials: 'include'
      });

      if (progressResponse.ok) {
        const progressResult = await progressResponse.json();
        if (progressResult.success) {
          setUser(progressResult.user);
          setProgress(progressResult.progress);
        } else {
          setError('Failed to load user data');
        }
      } else {
        setError('Authentication required');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(configuration.appLanguage === 'pt' ? 'pt-PT' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return '#10b981'; // green
    if (accuracy >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="neo-card">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--neo-text)' }}>{t('loading', configuration.appLanguage)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user || !progress) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="neo-card">
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error || 'User data not available'}</p>
            <button 
              onClick={onBack}
              className="neo-button neo-button-secondary"
            >
              {t('back', configuration.appLanguage)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--neo-text)' }}>
          User Profile
        </h1>
        {onBack && (
          <button
            onClick={onBack}
            className="neo-button neo-button-secondary"
          >
            {t('back', configuration.appLanguage)}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <div className="neo-card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: 'var(--neo-text-muted)' }}>
                  Username
                </label>
                <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                  {user.username}
                </p>
              </div>

              {user.email && (
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--neo-text-muted)' }}>
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                      {user.email}
                    </p>
                    {user.email_verified ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium" style={{ color: 'var(--neo-text-muted)' }}>
                  Member Since
                </label>
                <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                  {formatDate(user.created_at)}
                </p>
              </div>

              {user.last_login && (
                <div>
                  <label className="text-sm font-medium" style={{ color: 'var(--neo-text-muted)' }}>
                    Last Active
                  </label>
                  <p className="text-base" style={{ color: 'var(--neo-text)' }}>
                    {formatDate(user.last_login)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Overall Stats */}
            <div className="neo-card">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
                Overall Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--neo-text-muted)' }}>Total Attempts</span>
                  <span className="font-semibold text-lg" style={{ color: 'var(--neo-text)' }}>
                    {progress.totalAttempts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--neo-text-muted)' }}>Correct Answers</span>
                  <span className="font-semibold text-lg" style={{ color: getAccuracyColor(progress.accuracyRate) }}>
                    {progress.correctAttempts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--neo-text-muted)' }}>Accuracy Rate</span>
                  <span className="font-semibold text-xl" style={{ color: getAccuracyColor(progress.accuracyRate) }}>
                    {progress.accuracyRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Progress by Level */}
            <div className="neo-card">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
                Progress by Level
              </h3>
              <div className="space-y-3">
                {Object.entries(progress.levelProgress).map(([level, stats]) => {
                  const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                  return (
                    <div key={level} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium" style={{ color: 'var(--neo-text)' }}>
                          {level}
                        </span>
                        <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                          {stats.total} attempts
                        </span>
                      </div>
                      <span 
                        className="font-semibold"
                        style={{ color: stats.total > 0 ? getAccuracyColor(accuracy) : 'var(--neo-text-muted)' }}
                      >
                        {stats.total > 0 ? `${accuracy.toFixed(1)}%` : '0%'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Topics */}
          <div className="neo-card">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
              Topic Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(progress.topicProgress)
                .sort(([,a], [,b]) => b.total - a.total)
                .slice(0, 10)
                .map(([topic, stats]) => {
                  const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                  return (
                    <div key={topic} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-bg-secondary)' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--neo-text)' }}>
                          {topic}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--neo-text-muted)' }}>
                          {stats.total} attempts • {stats.correct} correct
                        </p>
                      </div>
                      <span 
                        className="font-semibold text-sm"
                        style={{ color: getAccuracyColor(accuracy) }}
                      >
                        {accuracy.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}