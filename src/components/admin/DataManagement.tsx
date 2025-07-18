'use client';

import { useState } from 'react';

export default function DataManagement() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tudobem-questions-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage('✅ Export completed successfully!');
      } else {
        const error = await response.json();
        setMessage(`❌ Export failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setMessage('❌ Export failed: Network error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setMessage('❌ Please select a file to import');
      return;
    }

    setIsImporting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Import completed successfully! Imported ${result.count} questions.`);
        setImportFile(null);
      } else {
        setMessage(`❌ Import failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage('❌ Import failed: Network error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setImportFile(file);
        setMessage('');
      } else {
        setMessage('❌ Please select a ZIP file');
        setImportFile(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="neo-card">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📤 Export Questions
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--neo-text-muted)' }}>
          Export all questions, answers, and explanations from the database as a ZIP-compressed JSON file.
        </p>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="neo-button neo-button-primary"
        >
          {isExporting ? (
            <>
              <span className="animate-spin">⏳</span>
              <span className="ml-2">Exporting...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span className="ml-2">Export Database</span>
            </>
          )}
        </button>
      </div>

      {/* Import Section */}
      <div className="neo-card">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--neo-text)' }}>
          📥 Import Questions
        </h2>
        <p className="text-sm mb-4" style={{ color: 'var(--neo-text-muted)' }}>
          Import questions from a ZIP file containing JSON data. This will add new questions to the database.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neo-text)' }}>
              Select ZIP file to import
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="neo-input w-full"
              disabled={isImporting}
            />
          </div>

          {importFile && (
            <div className="text-sm" style={{ color: 'var(--neo-text-muted)' }}>
              Selected file: {importFile.name} ({(importFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={isImporting || !importFile}
            className="neo-button neo-button-success"
          >
            {isImporting ? (
              <>
                <span className="animate-spin">⏳</span>
                <span className="ml-2">Importing...</span>
              </>
            ) : (
              <>
                <span>📤</span>
                <span className="ml-2">Import Data</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="neo-card">
          <div className="text-sm" style={{ color: 'var(--neo-text)' }}>
            {message}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="neo-card">
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--neo-text)' }}>
          📋 Instructions
        </h3>
        <div className="text-sm space-y-2" style={{ color: 'var(--neo-text-muted)' }}>
          <p><strong>Export:</strong> Downloads all questions from the database as a ZIP file containing JSON data.</p>
          <p><strong>Import:</strong> Uploads a ZIP file containing JSON data to add new questions to the database.</p>
          <p><strong>File Format:</strong> ZIP files should contain a JSON file with an array of question objects.</p>
          <p><strong>Note:</strong> Import will not overwrite existing questions with the same content.</p>
        </div>
      </div>
    </div>
  );
}