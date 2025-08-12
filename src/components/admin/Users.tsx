'use client';

import { useState, useEffect, useRef } from 'react';

interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
  email_verified: boolean;
  totalExercises: number;
  correctExercises: number;
  incorrectExercises: number;
  estimatedLevel: string;
  lastActivity: string | null;
}

interface UsersListResponse {
  users: AdminUser[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface DetailedUserStats {
  user: {
    id: string;
    username: string;
    email: string | null;
    created_at: string;
    last_login: string | null;
    is_active: boolean;
    email_verified: boolean;
    app_language?: string;
    explanation_language?: string;
    learning_mode?: string;
    oauth_provider?: string;
  };
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    accuracyRate: number;
  };
  levelAccuracies: Record<string, number>;
  recentSessions: Array<{
    date: string;
    exerciseCount: number;
    accuracy: number;
  }>;
}

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<DetailedUserStats | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  const isMountedRef = useRef(true);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const usersPerPage = 20;

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCurrentPage(1); // Reset to first page on search
        fetchUsers(1, searchTerm);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load
  useEffect(() => {
    fetchUsers(1, '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async (page: number = currentPage, search: string = searchTerm) => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError('');

    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/users?${searchParams}`);
      
      if (!isMountedRef.current) return;
      
      if (response.ok) {
        const result = await response.json();
        if (isMountedRef.current && result.success) {
          const data: UsersListResponse = result.data;
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
          setCurrentPage(data.currentPage);
        }
      } else {
        if (isMountedRef.current) {
          setError('Failed to fetch users');
        }
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      if (isMountedRef.current) {
        setError('Network error while fetching users');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setDetailsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSelectedUser(result.data);
          setShowUserDetails(true);
        }
      } else {
        setError('Failed to fetch user details');
      }
    } catch (error) {
      console.error('User details fetch error:', error);
      setError('Network error while fetching user details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const getAccuracyPercentage = (correct: number, total: number) => {
    if (total === 0) return '0%';
    return `${((correct / total) * 100).toFixed(1)}%`;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'var(--neo-success)',
      'A2': 'var(--neo-success)',
      'B1': 'var(--neo-warning)',
      'B2': 'var(--neo-warning)',
      'C1': 'var(--neo-error)',
      'C2': 'var(--neo-error)'
    };
    return colors[level] || 'var(--neo-text)';
  };

  const generatePaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(1);
      
      // Show ellipsis if current page is far from start
      if (currentPage > 4) {
        items.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);
      
      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) {
          items.push(i);
        }
      }
      
      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 3) {
        if (!items.includes('...')) {
          items.push('...');
        }
      }
      
      // Show last page
      if (totalPages > 1 && !items.includes(totalPages)) {
        items.push(totalPages);
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    }
    
    return items;
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg" style={{ color: 'var(--neo-text)' }}>
          <span className="animate-spin">⏳</span>
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <div className="neo-card text-center py-8">
        <div className="text-lg mb-4" style={{ color: 'var(--neo-error)' }}>
          ❌ {error}
        </div>
        <button
          onClick={() => fetchUsers(1, '')}
          className="neo-button neo-button-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with search */}
      <div className="neo-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--neo-text)' }}>
              👥 Users ({formatNumber(totalCount)})
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--neo-text-muted)' }}>
              Manage and view user statistics
            </p>
          </div>
          
          {/* Real-time search */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="neo-inset px-3 py-2 w-64 text-sm"
                style={{ 
                  color: 'var(--neo-text)',
                  backgroundColor: 'var(--neo-bg-secondary)'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
                  style={{ color: 'var(--neo-text-muted)' }}
                >
                  ✕
                </button>
              )}
            </div>
            {isLoading && (
              <span className="animate-spin">🔄</span>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="neo-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--neo-border)' }}>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>User</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Level</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Exercises</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Accuracy</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Joined</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Last Activity</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Status</th>
                <th className="text-left p-3 font-semibold" style={{ color: 'var(--neo-text)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id} 
                  className="border-b hover:bg-opacity-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--neo-border)' }}
                  onClick={() => fetchUserDetails(user.id)}
                >
                  <td className="p-3">
                    <div>
                      <div className="font-medium" style={{ color: 'var(--neo-text)' }}>
                        {user.username}
                      </div>
                      {user.email && (
                        <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                          {user.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <span 
                      className="px-2 py-1 rounded text-sm font-semibold"
                      style={{ 
                        color: getLevelColor(user.estimatedLevel),
                        backgroundColor: 'var(--neo-bg-secondary)'
                      }}
                    >
                      {user.estimatedLevel}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium" style={{ color: 'var(--neo-text)' }}>
                        {formatNumber(user.totalExercises)}
                      </div>
                      <div style={{ color: 'var(--neo-text-muted)' }}>
                        {formatNumber(user.correctExercises)} ✓ / {formatNumber(user.incorrectExercises)} ✗
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span 
                      className="font-medium"
                      style={{ 
                        color: user.totalExercises > 0 
                          ? (user.correctExercises / user.totalExercises) >= 0.7 
                            ? 'var(--neo-success)' 
                            : 'var(--neo-warning)'
                          : 'var(--neo-text-muted)'
                      }}
                    >
                      {getAccuracyPercentage(user.correctExercises, user.totalExercises)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                      {formatDate(user.created_at)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                      {formatDate(user.lastActivity || user.last_login)}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <span 
                        className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      <span className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {user.email_verified && (
                        <span className="text-xs ml-1" title="Email verified">✓</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchUserDetails(user.id);
                      }}
                      className="neo-button-sm text-xs"
                      disabled={detailsLoading}
                    >
                      {detailsLoading ? '...' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="text-lg" style={{ color: 'var(--neo-text-muted)' }}>
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="neo-button neo-button-primary mt-4"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="neo-card">
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, totalCount)} of {formatNumber(totalCount)} users
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="neo-button-sm"
              >
                ← Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {generatePaginationItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => typeof item === 'number' && handlePageChange(item)}
                    disabled={typeof item !== 'number' || isLoading}
                    className={`neo-button-sm min-w-[32px] ${currentPage === item ? 'neo-button-primary' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="neo-button-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUserDetails(false)}
        >
          <div 
            className="neo-card max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold" style={{ color: 'var(--neo-text)' }}>
                👤 User Details
              </h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="neo-button-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Info */}
              <div className="neo-inset p-4">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  Basic Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedUser.user.username}</div>
                  <div><strong>Email:</strong> {selectedUser.user.email || 'Not provided'}</div>
                  <div><strong>Joined:</strong> {formatDate(selectedUser.user.created_at)}</div>
                  <div><strong>Last Login:</strong> {formatDate(selectedUser.user.last_login)}</div>
                  <div><strong>Status:</strong> {selectedUser.user.is_active ? '✅ Active' : '❌ Inactive'}</div>
                  <div><strong>Email Verified:</strong> {selectedUser.user.email_verified ? '✅ Yes' : '❌ No'}</div>
                  {selectedUser.user.oauth_provider && (
                    <div><strong>OAuth Provider:</strong> {selectedUser.user.oauth_provider}</div>
                  )}
                </div>
              </div>

              {/* Learning Stats */}
              <div className="neo-inset p-4">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  Learning Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Total Attempts:</strong> {formatNumber(selectedUser.stats.totalAttempts)}</div>
                  <div><strong>Correct Answers:</strong> {formatNumber(selectedUser.stats.correctAttempts)}</div>
                  <div><strong>Overall Accuracy:</strong> {selectedUser.stats.accuracyRate.toFixed(1)}%</div>
                  <div><strong>App Language:</strong> {selectedUser.user.app_language || 'Default'}</div>
                  <div><strong>Learning Mode:</strong> {selectedUser.user.learning_mode || 'Default'}</div>
                </div>
              </div>

              {/* Level Accuracies */}
              <div className="neo-inset p-4">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  Accuracy by Level
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedUser.levelAccuracies).map(([level, accuracy]) => (
                    <div key={level} className="flex justify-between text-sm">
                      <span style={{ color: getLevelColor(level) }}>{level}</span>
                      <span className="font-medium">{accuracy.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sessions */}
              <div className="neo-inset p-4">
                <h4 className="font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
                  Recent Activity (Last 7 Days)
                </h4>
                {selectedUser.recentSessions.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.recentSessions.map((session, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                        <span>{session.exerciseCount} exercises ({session.accuracy.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                    No activity in the last 7 days
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}