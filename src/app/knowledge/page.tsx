'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocumentAnalytics } from '@/hooks/api-hooks';
import { formatFileSize, formatNumber } from '@/lib/utils';
import DocumentUpload from '@/components/documents/DocumentUpload';
import DocumentList from '@/components/documents/DocumentList';
import DocumentSearch from '@/components/documents/DocumentSearch';
import { Document, DocumentSearchResult } from '@/lib/types';

export default function KnowledgeBasePage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'search'>('upload');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [clientId] = useState('default-client'); // In real app, get from auth context

  const { data: analytics, isLoading: analyticsLoading } = useDocumentAnalytics({
    clientId,
    days: 30
  });

  const handleUploadComplete = (results: any) => {
    console.log('Upload completed:', results);
    setRefreshTrigger(prev => prev + 1);
    // Switch to documents tab after upload
    setActiveTab('documents');
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleSearchResultSelect = (result: DocumentSearchResult) => {
    console.log('Search result selected:', result);
    // Could navigate to document or show in modal
  };

  const tabs = [
    { id: 'upload', label: '📤 Upload', description: 'Add new documents' },
    { id: 'documents', label: '📚 Documents', description: 'Manage knowledge base' },
    { id: 'search', label: '🔍 Search', description: 'Find information' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          <p className="text-gray-400">
            Upload and manage documents for AI-powered customer support
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center animate-pulse">
              <div className="h-8 bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-white">
              {formatNumber(analytics?.total_documents || 0)}
            </div>
            <div className="text-sm text-gray-400">Total Documents</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics?.completed_documents || 0} processed
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-green-400">
              {Math.round(((analytics?.completed_documents || 0) / Math.max((analytics?.total_documents || 1), 1)) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Processing Rate</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics?.processing_documents || 0} in progress
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-blue-400">
              {formatFileSize(analytics?.total_file_size || 0)}
            </div>
            <div className="text-sm text-gray-400">Total Size</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatNumber(analytics?.total_words || 0)} words
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-yellow-400">
              {analytics?.fileTypes?.length || 0}
            </div>
            <div className="text-sm text-gray-400">File Types</div>
            <div className="text-xs text-gray-500 mt-1">
              {analytics?.fileTypes?.map(ft => ft.file_type.toUpperCase()).join(', ').slice(0, 20) || 'None'}
              {(analytics?.fileTypes?.length || 0) > 3 && '...'}
            </div>
          </motion.div>
                 </div>
       ) : null}

       {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.label}</span>
              </div>
              <div className="text-xs opacity-75 mt-1">
                {tab.description}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-2">
                🚀 Transform Your Customer Support
              </h2>
              <p className="text-gray-300 text-sm">
                Upload your company documents, manuals, FAQs, and policies. Our AI will process them 
                automatically and use them to provide accurate, contextual responses to customer emails.
              </p>
            </div>
            
            <DocumentUpload
              clientId={clientId}
              onUploadComplete={handleUploadComplete}
              multiple={true}
              maxFiles={10}
              maxFileSize={50 * 1024 * 1024}
            />
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DocumentList
              clientId={clientId}
              onDocumentSelect={handleDocumentSelect}
              refreshTrigger={refreshTrigger}
            />
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-2">
                🔍 Intelligent Knowledge Search
              </h2>
              <p className="text-gray-300 text-sm">
                Search across all your uploaded documents using AI-powered semantic search. 
                Find relevant information even when using different words or phrases.
              </p>
            </div>
            
            <DocumentSearch
              clientId={clientId}
              onResultSelect={handleSearchResultSelect}
            />
          </motion.div>
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDocument(null);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">
                    {selectedDocument.file_type === 'pdf' ? '📄' : 
                     selectedDocument.file_type === 'docx' ? '📝' : 
                     selectedDocument.file_type === 'xlsx' ? '📊' : '📁'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedDocument.processing_status === 'completed' ? 'text-green-400 bg-green-500/20' :
                    selectedDocument.processing_status === 'processing' ? 'text-blue-400 bg-blue-500/20' :
                    selectedDocument.processing_status === 'failed' ? 'text-red-400 bg-red-500/20' :
                    'text-yellow-400 bg-yellow-500/20'
                  }`}>
                    {selectedDocument.processing_status.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedDocument.title}</h2>
                <p className="text-gray-400 text-sm">{selectedDocument.original_filename}</p>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {selectedDocument.description && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Description</label>
                  <p className="text-white mt-1">{selectedDocument.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">File Size</label>
                  <p className="text-white">{formatFileSize(selectedDocument.file_size)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">File Type</label>
                  <p className="text-white">{selectedDocument.file_type.toUpperCase()}</p>
                </div>
                {selectedDocument.total_pages && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Pages</label>
                    <p className="text-white">{selectedDocument.total_pages}</p>
                  </div>
                )}
                {selectedDocument.total_words && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Words</label>
                    <p className="text-white">{selectedDocument.total_words.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-400">Uploaded</label>
                  <p className="text-gray-300 text-sm">{new Date(selectedDocument.uploaded_at).toLocaleString()}</p>
                </div>
                {selectedDocument.processed_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Processed</label>
                    <p className="text-gray-300 text-sm">{new Date(selectedDocument.processed_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedDocument(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 