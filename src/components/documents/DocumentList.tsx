'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDocuments, useDeleteDocument, useRetryProcessing } from '@/hooks/api-hooks';
import { formatDate, formatFileSize } from '@/lib/utils';
import { Document } from '@/lib/types';

interface DocumentListProps {
  clientId?: string;
  onDocumentSelect?: (document: Document) => void;
  refreshTrigger?: number;
}

export default function DocumentList({ 
  clientId, 
  onDocumentSelect,
  refreshTrigger
}: DocumentListProps) {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    fileType: 'all',
    sortBy: 'uploaded_at',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useDocuments({
    page: currentPage,
    limit: 20,
    clientId,
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status : undefined,
    fileType: filters.fileType !== 'all' ? filters.fileType : undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder
  });

  const deleteDocument = useDeleteDocument();
  const retryProcessing = useRetryProcessing();

  // Refresh when trigger changes
  React.useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  const documents = data?.documents || [];
  const pagination = data?.pagination;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return '📄';
      case 'docx':
      case 'doc': return '📝';
      case 'xlsx':
      case 'xls': return '📊';
      case 'pptx':
      case 'ppt': return '📺';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'tiff': return '🖼️';
      case 'txt': return '📃';
      default: return '📁';
    }
  };

  const handleDelete = async (documentId: string) => {
    if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        await deleteDocument.mutateAsync(documentId);
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleRetry = async (documentId: string) => {
    try {
      await retryProcessing.mutateAsync(documentId);
      refetch();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-48"></div>
                  <div className="h-3 bg-gray-600 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={filters.fileType}
          onChange={(e) => {
            setFilters({ ...filters, fileType: e.target.value });
            setCurrentPage(1);
          }}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="docx">Word</option>
          <option value="xlsx">Excel</option>
          <option value="pptx">PowerPoint</option>
          <option value="jpg">Images</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
          }}
          className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
        >
          <option value="uploaded_at-desc">Latest First</option>
          <option value="uploaded_at-asc">Oldest First</option>
          <option value="title-asc">Name A-Z</option>
          <option value="title-desc">Name Z-A</option>
          <option value="file_size-desc">Largest First</option>
          <option value="file_size-asc">Smallest First</option>
        </select>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
          <p className="text-gray-400">
            {filters.search || filters.status !== 'all' || filters.fileType !== 'all'
              ? "Try adjusting your filters or search query."
              : "Upload your first document to get started."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 transition-all cursor-pointer"
              onClick={() => onDocumentSelect?.(document)}
            >
              <div className="flex items-center justify-between">
                {/* Document Info */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="text-2xl flex-shrink-0">
                    {getFileTypeIcon(document.file_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white truncate">
                        {document.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(document.processing_status)}`}>
                        {document.processing_status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{document.original_filename}</span>
                      <span>{formatFileSize(document.file_size)}</span>
                      <span>{formatDate(document.uploaded_at)}</span>
                      {document.total_words && (
                        <span>{document.total_words.toLocaleString()} words</span>
                      )}
                    </div>

                    {/* Processing Progress */}
                    {document.processing_status === 'processing' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                          <span>Processing...</span>
                          <span>{document.processing_progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${document.processing_progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {document.processing_status === 'failed' && document.processing_error && (
                      <div className="mt-2 text-xs text-red-400">
                        Error: {document.processing_error}
                      </div>
                    )}

                    {/* Tags */}
                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                            +{document.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  {document.processing_status === 'failed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetry(document.id);
                      }}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                      disabled={retryProcessing.isPending}
                    >
                      {retryProcessing.isPending ? 'Retrying...' : 'Retry'}
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(document.id);
                    }}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                    disabled={deleteDocument.isPending}
                  >
                    {deleteDocument.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} documents
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
              disabled={currentPage === pagination.pages}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 