'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UsageStats {
  totalUsers: number;
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  countries: { country: string; count: number }[];
  platforms: { platform: string; count: number }[];
  levels: { level: string; count: number }[];
  dailyStats: { date: string; users: number; questions: number; correct: number }[];
}

export default function UsageAnalytics() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const isMountedRef = useRef(true);
  const timeRangeRef = useRef(timeRange);

  // Update ref when state changes
  timeRangeRef.current = timeRange;

  const fetchAnalytics = useCallback(async (range?: string) => {
    if (!isMountedRef.current) return;
    
    const rangeToUse = range || timeRangeRef.current;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/analytics?range=${rangeToUse}`);
      if (!isMountedRef.current) return;
      
      if (response.ok) {
        const data = await response.json();
        if (isMountedRef.current) {
          setStats(data);
        }
      } else {
        if (isMountedRef.current) {
          setError('Failed to fetch analytics');
        }
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
      if (isMountedRef.current) {
        setError('Network error while fetching analytics');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchAnalytics]);

  // Separate effect to handle time range changes - don't include stats as dependency to avoid infinite loop
  useEffect(() => {
    // Only fetch if this is not the initial render (stats is already loaded)
    if (stats !== null) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const calculateAccuracy = () => {
    if (!stats || stats.totalQuestions === 0) return 0;
    return ((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg" style={{ color: 'var(--neo-text)' }}>
          <span className="animate-spin">⏳</span>
          <span className="ml-2">Loading analytics...</span>
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
          onClick={() => fetchAnalytics()}
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
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter */}
      <div className="neo-card">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📈 Usage Analytics
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { value: '1d', label: 'Last 24 hours' },
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`neo-button text-sm ${timeRange === range.value ? 'neo-button-primary' : ''}`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neo-card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
            {formatNumber(stats.totalUsers)}
          </div>
          <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            Total Users
          </div>
        </div>

        <div className="neo-card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
            {formatNumber(stats.totalSessions)}
          </div>
          <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            Total Sessions
          </div>
        </div>

        <div className="neo-card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent-text)' }}>
            {formatNumber(stats.totalQuestions)}
          </div>
          <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            Questions Answered
          </div>
        </div>

        <div className="neo-card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--neo-success-text)' }}>
            {calculateAccuracy()}%
          </div>
          <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
            Accuracy Rate
          </div>
        </div>
      </div>

      {/* Answer Distribution */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          ✅ Answer Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 neo-outset-sm">
            <div className="text-lg font-bold" style={{ color: 'var(--neo-success-text)' }}>
              {formatNumber(stats.correctAnswers)}
            </div>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              Correct Answers
            </div>
          </div>
          <div className="p-4 neo-outset-sm">
            <div className="text-lg font-bold" style={{ color: 'var(--neo-error)' }}>
              {formatNumber(stats.incorrectAnswers)}
            </div>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              Incorrect Answers
            </div>
          </div>
        </div>
      </div>

      {/* Countries */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          🌍 Users by Country
        </h3>
        <div className="space-y-2">
          {stats.countries.slice(0, 10).map((country) => (
            <div key={country.country} className="flex items-center justify-between p-2 neo-outset-sm">
              <span className="text-sm" style={{ color: 'var(--neo-text)' }}>
                {country.country}
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                {formatNumber(country.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platforms */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📱 Platforms
        </h3>
        <div className="space-y-2">
          {stats.platforms.map((platform) => (
            <div key={platform.platform} className="flex items-center justify-between p-2 neo-outset-sm">
              <span className="text-sm" style={{ color: 'var(--neo-text)' }}>
                {platform.platform}
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                {formatNumber(platform.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Levels */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📚 Popular Levels
        </h3>
        <div className="space-y-2">
          {stats.levels.map((level) => (
            <div key={level.level} className="flex items-center justify-between p-2 neo-outset-sm">
              <span className="text-sm" style={{ color: 'var(--neo-text)' }}>
                {level.level}
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--neo-accent-text)' }}>
                {formatNumber(level.count)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Chart Placeholder */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📊 Daily Activity
        </h3>
        <div className="text-center py-8" style={{ color: 'var(--neo-text-muted)' }}>
          <div className="text-sm">
            Chart visualization will be implemented here
          </div>
          <div className="text-xs mt-2">
            Daily stats: {stats.dailyStats.length} data points
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={() => fetchAnalytics()}
          className="neo-button neo-button-primary"
        >
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}