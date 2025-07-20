'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEmailLogs } from '@/hooks/api-hooks';
import { EmailLog } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function EmailsPage() {
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);

  const { data: emails, isLoading, error, refetch } = useEmailLogs();

  // Filter emails based on direction and search
  const filteredEmails = emails?.filter((email: EmailLog) => {
    const matchesFilter = filter === 'all' || email.direction === filter;
    const matchesSearch = email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.to_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'incoming': return 'text-blue-400';
      case 'outgoing': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Email Logs</h1>
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">
          ❌ Error loading email logs: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Logs</h1>
          <p className="text-gray-400">
            {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <motion.button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Refresh
        </motion.button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {(['all', 'incoming', 'outgoing'] as const).map((direction) => (
            <button
              key={direction}
              onClick={() => setFilter(direction)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === direction
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Email Logs List */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-xl font-semibold text-white mb-2">No emails found</h3>
          <p className="text-gray-400">
            {emails?.length === 0 
              ? "No emails have been processed yet." 
              : "Try adjusting your filters or search query."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEmails.map((email: EmailLog) => (
            <motion.div
              key={email.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => setSelectedEmail(email)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Email Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getDirectionColor(email.direction)}`}>
                    {email.direction === 'incoming' ? '📥' : '📤'} {email.direction?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(email.status || 'unknown')}`}>
                    {email.status || 'unknown'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(email.processed_at)}
                </span>
              </div>

              {/* Email Content */}
              <div className="space-y-2">
                <h3 className="text-white font-medium line-clamp-1">
                  {email.subject || 'No Subject'}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-400">
                  <span className="line-clamp-1">
                    <span className="text-gray-500">From:</span> {email.from_email}
                  </span>
                  <span className="line-clamp-1">
                    <span className="text-gray-500">To:</span> {email.to_email}
                  </span>
                </div>

                {email.error_message && (
                  <div className="text-red-400 text-xs bg-red-900/20 px-2 py-1 rounded">
                    Error: {email.error_message}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
                <span>ID: #{email.id}</span>
                <span>{formatDate(email.processed_at)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedEmail(null);
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
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-lg ${getDirectionColor(selectedEmail.direction)}`}>
                    {selectedEmail.direction === 'incoming' ? '📥' : '📤'}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {selectedEmail.subject || 'No Subject'}
                  </h2>
                </div>
                <p className="text-gray-400">Email #{selectedEmail.id}</p>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Status & Direction */}
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Direction</label>
                  <div className={`text-sm font-medium mt-1 ${getDirectionColor(selectedEmail.direction)}`}>
                    {selectedEmail.direction?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs border mt-1 ${getStatusColor(selectedEmail.status || 'unknown')}`}>
                    {selectedEmail.status || 'unknown'}
                  </div>
                </div>
              </div>

              {/* Email Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">From</label>
                  <p className="text-white mt-1">{selectedEmail.from_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">To</label>
                  <p className="text-white mt-1">{selectedEmail.to_email}</p>
                </div>
              </div>

              {/* Error Message */}
              {selectedEmail.error_message && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Error</label>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mt-1">
                    <p className="text-red-300">{selectedEmail.error_message}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-400">Processed At</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedEmail.processed_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Relative Time</label>
                  <p className="text-gray-300 text-sm">{formatRelativeTime(selectedEmail.processed_at)}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedEmail(null)}
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