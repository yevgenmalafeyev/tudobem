'use client';

import { useState, useEffect, useRef } from 'react';

interface QuestionStats {
  total: number;
  byLevel: { level: string; count: number }[];
  byTopic: { topic: string; count: number }[];
}

export default function QuestionStats() {
  const [stats, setStats] = useState<QuestionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const isMountedRef = useRef(true);

  useEffect(() => {
    fetchStats();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchStats = async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/stats');
      if (!isMountedRef.current) return;
      
      if (response.ok) {
        const response_data = await response.json();
        if (isMountedRef.current) {
          // Extract the actual stats from the API response structure
          setStats(response_data.data || response_data);
        }
      } else {
        if (isMountedRef.current) {
          setError('Failed to fetch statistics');
        }
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
      if (isMountedRef.current) {
        setError('Network error while fetching statistics');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  if (isLoading) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg" style={{ color: 'var(--neo-text)' }}>
          <span className="animate-spin">⏳</span>
          <span className="ml-2">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg mb-4" style={{ color: 'var(--neo-error)' }}>
          ❌ {error}
        </div>
        <button
          onClick={fetchStats}
          className="neo-button neo-button-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg" style={{ color: 'var(--neo-text-muted)' }}>
          No statistics available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total Questions */}
      <div className="neo-card text-center">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--neo-text)' }}>
          📊 Total Questions
        </h2>
        <div className="text-4xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
          {formatNumber(stats.total)}
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--neo-text-muted)' }}>
          Total questions in database
        </p>
      </div>

      {/* Questions by Level */}
      <div className="neo-card">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📈 Questions by Level
        </h3>
        <div className="space-y-3">
          {(stats.byLevel || []).map((level) => (
            <div key={level.level} className="flex items-center justify-between p-3 neo-outset-sm">
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold" style={{ color: 'var(--neo-text)' }}>
                  {level.level}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                  {formatNumber(level.count)}
                </span>
                <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                  ({((level.count / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions by Topic */}
      <div className="neo-card">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📚 Questions by Topic
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(stats.byTopic || []).map((topic) => (
            <div key={topic.topic} className="flex items-center justify-between p-2 neo-outset-sm">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate" style={{ color: 'var(--neo-text)' }}>
                  {topic.topic}
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                  {formatNumber(topic.count)}
                </span>
                <span className="text-xs" style={{ color: 'var(--neo-text-muted)' }}>
                  ({((topic.count / stats.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchStats}
          className="neo-button neo-button-primary"
        >
          🔄 Refresh Statistics
        </button>
      </div>
    </div>
  );
}