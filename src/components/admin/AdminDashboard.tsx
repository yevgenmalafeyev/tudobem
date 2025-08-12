'use client';

import { useState } from 'react';
import Logo from '@/components/Logo';
import DataManagement from './DataManagement';
import QuestionStats from './QuestionStats';
import UsageAnalytics from './UsageAnalytics';
import Users from './Users';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminView = 'data' | 'stats' | 'analytics' | 'users';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('data');

  const views = [
    { id: 'data' as AdminView, name: 'Data Management', icon: '📁' },
    { id: 'stats' as AdminView, name: 'Question Stats', icon: '📊' },
    { id: 'analytics' as AdminView, name: 'Usage Analytics', icon: '📈' },
    { id: 'users' as AdminView, name: 'Users', icon: '👥' }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'data':
        return <DataManagement />;
      case 'stats':
        return <QuestionStats />;
      case 'analytics':
        return <UsageAnalytics />;
      case 'users':
        return <Users />;
      default:
        return <DataManagement />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="neo-card-sm mx-4 my-4 sm:mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo className="hover:scale-105 transition-transform" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold" style={{ color: 'var(--neo-text)' }}>
                Tudobem Admin
              </h1>
            </div>
            
            <button
              onClick={onLogout}
              className="neo-button text-sm sm:text-base px-4 py-2 hover:bg-red-50"
              style={{ color: 'var(--neo-error)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="neo-card-sm mx-4 mb-4 sm:mx-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-1 sm:space-x-2">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => setCurrentView(view.id)}
                className={`neo-button text-sm sm:text-base px-3 sm:px-4 py-2 flex items-center space-x-2 ${
                  currentView === view.id ? 'neo-button-primary' : ''
                }`}
              >
                <span>{view.icon}</span>
                <span className="hidden sm:inline">{view.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}