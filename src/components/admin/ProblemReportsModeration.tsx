'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProblemReportWithExercise, AIAssistanceResponse } from '@/types/problem-report';

interface ProblemReportsResponse {
  success: boolean;
  data: {
    reports: ProblemReportWithExercise[];
    total: number;
    totalPages: number;
  };
}

interface AIAssistanceModalProps {
  report: ProblemReportWithExercise;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (reportId: string) => void;
}

function AIAssistanceModal({ report, isOpen, onClose, onAccept }: AIAssistanceModalProps) {
  const [aiResponse, setAiResponse] = useState<AIAssistanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAIAssistance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/problem-reports/${report.id}/ai-assistance`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to get AI assistance');
      }
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteCorrection = async () => {
    if (!aiResponse?.sqlCorrection) return;

    try {
      const response = await fetch(`/api/admin/problem-reports/${report.id}/execute-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sqlCorrection: aiResponse.sqlCorrection,
        }),
      });

      if (response.ok) {
        onAccept(report.id);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to execute correction');
      }
    } catch (error) {
      console.error('Error executing correction:', error);
      setError('Network error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">AI Assistance for Report #{report.id}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Report Summary */}
          <div className="bg-gray-50 p-4 rounded mb-6">
            <h3 className="font-semibold mb-2">Report Summary</h3>
            <p><strong>Type:</strong> {report.problemType}</p>
            <p><strong>Exercise:</strong> {report.exercise.sentence}</p>
            <p><strong>User Comment:</strong> {report.userComment}</p>
          </div>

          {!aiResponse && !isLoading && (
            <div className="text-center">
              <button
                onClick={handleGetAIAssistance}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Get AI Assistance
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Analyzing with AI...</p>
            </div>
          )}

          {aiResponse && (
            <div className="space-y-6">
              {/* Analysis Status Header */}
              <div className={`p-4 rounded-lg border-l-4 ${
                aiResponse.isValid 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {aiResponse.isValid ? '✅' : '❌'}
                  </span>
                  <h3 className="text-lg font-bold">
                    {aiResponse.isValid ? 'Valid Issue Detected' : 'No Action Required'}
                  </h3>
                  {aiResponse.severity && (
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      aiResponse.severity === 'high' ? 'bg-red-100 text-red-800' :
                      aiResponse.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {aiResponse.severity} severity
                    </span>
                  )}
                  {aiResponse.category && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {aiResponse.category.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>

              {/* Structured AI Analysis */}
              <div className="bg-white border rounded-lg">
                <div className="px-4 py-3 bg-gray-50 border-b font-medium text-gray-900">
                  🤖 AI Analysis Report
                </div>
                <div className="p-4">
                  <div className="prose prose-sm max-w-none">
                    {aiResponse.explanation.split('\n').map((line, index) => {
                      // Check if line starts with emoji and text pattern
                      if (line.match(/^[📋🔍📊🎯🔧💡✅][^\n]*/)) {
                        return (
                          <div key={index} className="mb-4">
                            <div className="font-semibold text-gray-800 mb-2">{line}</div>
                          </div>
                        );
                      } else if (line.trim().startsWith('•')) {
                        return (
                          <div key={index} className="ml-4 mb-1 text-gray-600">
                            {line.trim()}
                          </div>
                        );
                      } else if (line.trim().length > 0 && !line.match(/^\*\*/)) {
                        return (
                          <div key={index} className="mb-2 text-gray-700 leading-relaxed">
                            {line}
                          </div>
                        );
                      }
                      return <div key={index} className="mb-2"></div>;
                    })}
                  </div>
                </div>
              </div>

              {/* Additional Analysis Details */}
              {(aiResponse.changes || aiResponse.reasoning) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResponse.changes && (
                    <div className="bg-blue-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-blue-900 mb-2">📝 Proposed Changes</h4>
                      <p className="text-blue-800 text-sm">{aiResponse.changes}</p>
                    </div>
                  )}
                  {aiResponse.reasoning && (
                    <div className="bg-purple-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-purple-900 mb-2">🧠 Reasoning</h4>
                      <p className="text-purple-800 text-sm">{aiResponse.reasoning}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SQL Correction Block */}
              {aiResponse.sqlCorrection && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <span>🔧</span>
                    SQL Correction Statement
                  </h3>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 text-gray-300 text-xs font-medium">
                      PostgreSQL UPDATE Statement
                    </div>
                    <pre className="text-green-400 p-4 text-sm overflow-x-auto font-mono">
                      {aiResponse.sqlCorrection}
                    </pre>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    ⚠️ This SQL will be executed directly on the database. Please review carefully.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
                
                {aiResponse.isValid && aiResponse.sqlCorrection && (
                  <button
                    onClick={handleExecuteCorrection}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium flex items-center gap-2"
                  >
                    <span>⚡</span>
                    Execute Correction & Accept Report
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProblemReportsModeration() {
  const [reports, setReports] = useState<ProblemReportWithExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('pending');
  const [selectedReport, setSelectedReport] = useState<ProblemReportWithExercise | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const loadReports = useCallback(async (page: number = currentPage, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '20',
      });
      
      if (status && status !== 'all') {
        params.append('status', status);
      }

      const response = await fetch(`/api/admin/problem-reports?${params}`);
      
      if (response.ok) {
        const data: ProblemReportsResponse = await response.json();
        setReports(data.data.reports);
        setTotalPages(data.data.totalPages);
      } else {
        setError('Failed to load reports');
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    const loadData = async () => {
      await loadReports(1, statusFilter === 'all' ? undefined : statusFilter);
      setCurrentPage(1);
    };
    loadData();
  }, [statusFilter, loadReports]);

  const handleStatusChange = async (reportId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch(`/api/admin/problem-reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          adminComment: action === 'accept' ? 'Accepted by admin' : 'Declined by admin',
        }),
      });

      if (response.ok) {
        // Reload reports to reflect changes
        await loadReports();
      } else {
        const errorData = await response.json();
        setError(errorData.error || `Failed to ${action} report`);
      }
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
      setError('Network error occurred');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  const getProblemTypeLabel = (type: string) => {
    switch (type) {
      case 'irrelevant_hint': return 'Irrelevant Hint';
      case 'incorrect_answer': return 'Incorrect Answer';
      case 'missing_option': return 'Missing Option';
      case 'other': return 'Other';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Problem Reports Moderation</h1>
          
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {[
              { value: 'all', label: 'All Reports' },
              { value: 'pending', label: 'Pending' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'declined', label: 'Declined' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as 'all' | 'pending' | 'accepted' | 'declined')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Report
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Reporter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96">
                      Exercise Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                      Problem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                      Actions
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">#{report.id.slice(0, 8)}</div>
                        <div className="text-gray-500 text-xs">{formatDate(report.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm text-gray-900">
                        {report.reporterUsername ? (
                          <>
                            <div className="font-medium">{report.reporterUsername}</div>
                            {report.reporterEmail && (
                              <div className="text-gray-500 text-xs">{report.reporterEmail}</div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500 italic">Anonymous</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900 space-y-2">
                        {/* Exercise Sentence */}
                        <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                          <div className="font-medium text-blue-900 mb-1">Exercise:</div>
                          <div className="text-blue-800">{report.exercise.sentence}</div>
                        </div>
                        
                        {/* Answer and Metadata */}
                        <div className="bg-green-50 p-2 rounded-md">
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <span className="font-medium text-green-800">Answer:</span>
                              <div className="text-green-700 font-medium">{report.exercise.correctAnswer}</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Level:</span>
                              <div className="text-green-700">{report.exercise.level}</div>
                            </div>
                            <div>
                              <span className="font-medium text-green-800">Topic:</span>
                              <div className="text-green-700 truncate" title={report.exercise.topic}>{report.exercise.topic}</div>
                            </div>
                          </div>
                        </div>

                        {/* Hint if exists */}
                        {report.exercise.hint && (
                          <div className="bg-yellow-50 p-2 rounded-md">
                            <span className="font-medium text-yellow-800 text-xs">Hint:</span>
                            <div className="text-yellow-700 text-xs">{report.exercise.hint}</div>
                          </div>
                        )}

                        {/* Multiple Choice Options if exists */}
                        {report.exercise.multipleChoiceOptions && report.exercise.multipleChoiceOptions.length > 0 && (
                          <div className="bg-purple-50 p-2 rounded-md">
                            <span className="font-medium text-purple-800 text-xs">Options:</span>
                            <div className="text-purple-700 text-xs">
                              {report.exercise.multipleChoiceOptions.join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium mb-2">{getProblemTypeLabel(report.problemType)}</div>
                        <div className="bg-gray-50 p-3 rounded-md border-l-2 border-gray-300">
                          <div className="text-gray-700 text-sm leading-relaxed">{report.userComment}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap align-top">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium align-top">
                      {report.status === 'pending' && (
                        <div className="space-y-2">
                          <div className="space-x-2">
                            <button
                              onClick={() => handleStatusChange(report.id, 'accept')}
                              className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(report.id, 'decline')}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setAiModalOpen(true);
                            }}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 w-full"
                          >
                            🤖 AI Assistance
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  loadReports(newPage);
                }}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  loadReports(newPage);
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* AI Assistance Modal */}
      {selectedReport && (
        <AIAssistanceModal
          report={selectedReport}
          isOpen={aiModalOpen}
          onClose={() => {
            setAiModalOpen(false);
            setSelectedReport(null);
          }}
          onAccept={(reportId) => {
            handleStatusChange(reportId, 'accept');
            setSelectedReport(null);
          }}
        />
      )}
      </div>
    </div>
  );
}