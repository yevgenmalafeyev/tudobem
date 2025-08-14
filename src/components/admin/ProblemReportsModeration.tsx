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
            <div className="space-y-4">
              <div className={`p-4 rounded ${aiResponse.isValid ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                <h3 className="font-semibold mb-2">
                  AI Analysis: {aiResponse.isValid ? '✅ Valid Issue' : '❌ Not Valid'}
                </h3>
                <p>{aiResponse.explanation}</p>
              </div>

              {aiResponse.sqlCorrection && (
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Suggested SQL Correction:</h3>
                  <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    {aiResponse.sqlCorrection}
                  </pre>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {aiResponse.isValid && aiResponse.sqlCorrection && (
                  <button
                    onClick={handleExecuteCorrection}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Execute Correction
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Problem Reports Moderation</h1>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'accepted' | 'declined')}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exercise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">#{report.id.slice(0, 8)}</div>
                        <div className="text-gray-500">{formatDate(report.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.reporterUsername ? (
                          <>
                            <div className="font-medium">{report.reporterUsername}</div>
                            {report.reporterEmail && (
                              <div className="text-gray-500">{report.reporterEmail}</div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-500 italic">Anonymous</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{report.exercise.sentence}</div>
                        <div className="text-gray-500">
                          Answer: {report.exercise.correctAnswer} | Level: {report.exercise.level} | Topic: {report.exercise.topic}
                        </div>
                        {report.exercise.hint && (
                          <div className="text-gray-500">Hint: {report.exercise.hint}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{getProblemTypeLabel(report.problemType)}</div>
                        <div className="text-gray-500 max-w-xs truncate">{report.userComment}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(report.id, 'accept')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(report.id, 'decline')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              setSelectedReport(report);
                              setAiModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            AI Assistance
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
}