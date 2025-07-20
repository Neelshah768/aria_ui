'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTickets } from '@/hooks/api-hooks';
import { Ticket } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function TicketsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data: tickets, isLoading, error, refetch } = useTickets();

  // Filter tickets based on status and search
  const filteredTickets = tickets?.filter((ticket: Ticket) => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'new': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Tickets</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 bg-gray-700 rounded mb-1"></div>
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
          ❌ Error loading tickets: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tickets</h1>
          <p className="text-gray-400">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
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
          {(['all', 'open', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-white mb-2">No tickets found</h3>
          <p className="text-gray-400">
            {tickets?.length === 0 
              ? "No tickets have been created yet." 
              : "Try adjusting your filters or search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTickets.map((ticket: Ticket) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => setSelectedTicket(ticket)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Ticket Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-400">#{ticket.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority?.toUpperCase() || 'NORMAL'}
                </span>
              </div>

              {/* Ticket Content */}
              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {ticket.subject}
              </h3>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {ticket.customer_email}
              </p>

              {/* AI Response Indicator */}
              {ticket.ai_response && (
                <div className="flex items-center gap-1 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 text-xs">AI Responded</span>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{formatRelativeTime(ticket.created_at)}</span>
                <span>{formatDate(ticket.created_at)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedTicket(null);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-white">Ticket #{selectedTicket.id}</h2>
                <p className="text-gray-400">{selectedTicket.customer_email}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Status & Priority */}
              <div className="flex gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs border mt-1 ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Priority</label>
                  <div className={`text-sm font-medium mt-1 ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority?.toUpperCase() || 'NORMAL'}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium text-gray-400">Subject</label>
                <p className="text-white mt-1">{selectedTicket.subject}</p>
              </div>

              {/* Original Message */}
              <div>
                <label className="text-sm font-medium text-gray-400">Original Message</label>
                <div className="bg-gray-800 rounded-lg p-4 mt-1">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedTicket.original_message || 'No message content available.'}
                  </p>
                </div>
              </div>

              {/* AI Response */}
              {selectedTicket.ai_response && (
                <div>
                  <label className="text-sm font-medium text-gray-400">AI Response</label>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mt-1">
                    <p className="text-green-300 whitespace-pre-wrap">
                      {selectedTicket.ai_response}
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedTicket.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Updated</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedTicket.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Edit Ticket
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 