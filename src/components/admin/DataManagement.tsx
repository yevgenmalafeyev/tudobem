'use client';

import { useState, useEffect } from 'react';

interface LevelStats {
  level: string;
  totalQuestions: number;
  users50Percent: number;
  users75Percent: number;
  users90Percent: number;
  usersComplete: number;
}

interface LevelCosts {
  level: string;
  totalCostUsd: number;
  totalQuestions: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  generationCount: number;
  lastGeneration: string | null;
}

interface TotalCosts {
  grandTotalCostUsd: number;
  grandTotalQuestions: number;
  grandTotalInputTokens: number;
  grandTotalOutputTokens: number;
  totalGenerations: number;
}

interface GenerationProgress {
  level: string;
  isGenerating: boolean;
  progress: number;
  totalTopics: number;
  currentTopic: string;
}

export default function DataManagement() {
  const [levelStats, setLevelStats] = useState<LevelStats[]>([]);
  const [levelCosts, setLevelCosts] = useState<LevelCosts[]>([]);
  const [totalCosts, setTotalCosts] = useState<TotalCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress[]>([]);
  const [message, setMessage] = useState('');

  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResponse, costsResponse] = await Promise.all([
        fetch('/api/admin/level-stats'),
        fetch('/api/admin/generation-costs')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setLevelStats(statsData.levelStats);
      } else {
        setMessage('❌ Failed to load level statistics');
      }

      if (costsResponse.ok) {
        const costsData = await costsResponse.json();
        setLevelCosts(costsData.levelCosts);
        setTotalCosts(costsData.totalCosts);
      } else {
        console.warn('Failed to load cost data');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('❌ Network error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async (level: string) => {
    // Initialize progress tracking for this level
    setGenerationProgress(prev => [
      ...prev.filter(p => p.level !== level),
      {
        level,
        isGenerating: true,
        progress: 0,
        totalTopics: 0,
        currentTopic: 'Initializing...'
      }
    ]);

    try {
      const response = await fetch('/api/admin/generate-bulk-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level })
      });

      if (response.ok) {
        // Use Server-Sent Events to track progress
        const eventSource = new EventSource(`/api/admin/generate-bulk-questions/progress?level=${level}`);
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'progress') {
            setGenerationProgress(prev => prev.map(p => 
              p.level === level 
                ? { ...p, progress: data.progress, currentTopic: data.currentTopic, totalTopics: data.totalTopics }
                : p
            ));
          } else if (data.type === 'complete') {
            setGenerationProgress(prev => prev.filter(p => p.level !== level));
            const costMsg = data.cost ? ` (Cost: $${data.cost.totalCostUsd.toFixed(3)})` : '';
            setMessage(`✅ Generated ${data.questionsAdded} questions for ${level} level!${costMsg}`);
            loadData(); // Refresh the statistics and costs
            eventSource.close();
          } else if (data.type === 'error') {
            setGenerationProgress(prev => prev.filter(p => p.level !== level));
            setMessage(`❌ Generation failed for ${level}: ${data.error}`);
            eventSource.close();
          }
        };

        eventSource.onerror = () => {
          setGenerationProgress(prev => prev.filter(p => p.level !== level));
          setMessage(`❌ Connection error during ${level} generation`);
          eventSource.close();
        };
      } else {
        const error = await response.json();
        setGenerationProgress(prev => prev.filter(p => p.level !== level));
        setMessage(`❌ Failed to start generation for ${level}: ${error.error}`);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationProgress(prev => prev.filter(p => p.level !== level));
      setMessage(`❌ Network error starting ${level} generation`);
    }
  };

  const getLevelProgress = (level: string) => {
    return generationProgress.find(p => p.level === level);
  };

  const getLevelCost = (level: string) => {
    return levelCosts.find(c => c.level === level);
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return '$0.000';
    if (cost < 0.001) return '<$0.001';
    return `$${cost.toFixed(3)}`;
  };

  return (
    <div className="space-y-6">
      <div className="neo-card">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--neo-text)' }}>
          📊 Level Statistics & Question Generation
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2" style={{ color: 'var(--neo-text-muted)' }}>Loading level statistics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {levels.map((level) => {
              const stats = levelStats.find(s => s.level === level);
              const costs = getLevelCost(level);
              const progress = getLevelProgress(level);
              
              return (
                <div key={level} className="border rounded-lg p-6" style={{ borderColor: 'var(--neo-border)', backgroundColor: 'var(--neo-card-bg)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold" style={{ color: 'var(--neo-text)' }}>
                          Level {level}
                        </h3>
                        {costs && (
                          <div className="text-right">
                            <div className="text-sm font-medium" style={{ color: 'var(--neo-text)' }}>Generation Cost:</div>
                            <div className="text-lg font-bold" style={{ color: 'var(--neo-accent)' }}>
                              {formatCost(costs.totalCostUsd)}
                            </div>
                            <div className="text-xs" style={{ color: 'var(--neo-text-muted)' }}>
                              {costs.generationCount} generation{costs.generationCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium" style={{ color: 'var(--neo-text)' }}>Total Questions:</span>
                          <div className="text-lg font-bold" style={{ color: 'var(--neo-accent)' }}>
                            {stats?.totalQuestions || 0}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--neo-text)' }}>50%+ Complete:</span>
                          <div className="text-lg font-bold text-green-600">
                            {stats?.users50Percent || 0}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--neo-text)' }}>75%+ Complete:</span>
                          <div className="text-lg font-bold text-blue-600">
                            {stats?.users75Percent || 0}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--neo-text)' }}>90%+ Complete:</span>
                          <div className="text-lg font-bold text-purple-600">
                            {stats?.users90Percent || 0}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium" style={{ color: 'var(--neo-text)' }}>100% Complete:</span>
                          <div className="text-lg font-bold text-yellow-600">
                            {stats?.usersComplete || 0}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {progress ? (
                        <div className="text-center min-w-[200px]">
                          <div className="text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
                            Generating Questions...
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs" style={{ color: 'var(--neo-text-muted)' }}>
                            {progress.currentTopic}
                          </div>
                          <div className="text-xs mt-1" style={{ color: 'var(--neo-text-muted)' }}>
                            {progress.progress}% complete
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateQuestions(level)}
                          className="neo-button neo-button-primary"
                          disabled={generationProgress.some(p => p.isGenerating)}
                        >
                          <span>🤖</span>
                          <span className="ml-2">Generate 3 Questions per Topic</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className="neo-card">
          <div className="text-sm" style={{ color: 'var(--neo-text)' }}>
            {message}
          </div>
        </div>
      )}

      {/* Total Cost Summary */}
      {totalCosts && totalCosts.grandTotalCostUsd > 0 && (
        <div className="neo-card">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
            💰 Total Generation Costs Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neo-hover)', borderColor: 'var(--neo-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent)' }}>
                {formatCost(totalCosts.grandTotalCostUsd)}
              </div>
              <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Total Cost
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neo-hover)', borderColor: 'var(--neo-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent)' }}>
                {totalCosts.grandTotalQuestions.toLocaleString()}
              </div>
              <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Questions Generated
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neo-hover)', borderColor: 'var(--neo-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent)' }}>
                {((totalCosts.grandTotalInputTokens + totalCosts.grandTotalOutputTokens) / 1000).toFixed(0)}K
              </div>
              <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Total Tokens
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--neo-hover)', borderColor: 'var(--neo-border)' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--neo-accent)' }}>
                {totalCosts.totalGenerations}
              </div>
              <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
                Total Generations
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--neo-bg)', borderColor: 'var(--neo-border)' }}>
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              <strong>Cost per question:</strong> {totalCosts.grandTotalQuestions > 0 ? formatCost(totalCosts.grandTotalCostUsd / totalCosts.grandTotalQuestions) : '$0.000'}
              {' • '}
              <strong>Avg tokens per question:</strong> {totalCosts.grandTotalQuestions > 0 ? Math.round((totalCosts.grandTotalInputTokens + totalCosts.grandTotalOutputTokens) / totalCosts.grandTotalQuestions) : 0}
            </div>
          </div>
        </div>
      )}

      {/* Token Optimization Suggestions */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
          💡 AI Token Optimization Suggestions
        </h3>
        <div className="text-sm space-y-2" style={{ color: 'var(--neo-text-muted)' }}>
          <p><strong>1. Prompt Caching:</strong> Pre-compile level prompts into optimized templates to reduce repeated token usage.</p>
          <p><strong>2. Batch Processing:</strong> Generate multiple topics in single API calls instead of individual requests.</p>
          <p><strong>3. Template Reuse:</strong> Cache successful question patterns and reuse structure with different content.</p>
          <p><strong>4. Smart Scheduling:</strong> Run generation during off-peak hours when API costs are lower.</p>
          <p><strong>5. Progressive Generation:</strong> Generate only popular topics first, then expand based on user demand.</p>
        </div>
      </div>
    </div>
  );
}