'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

interface KnowledgeEntry {
  id: number;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  // Mock data for knowledge base entries - in a real app this would come from an API
  const knowledgeEntries: KnowledgeEntry[] = [
    {
      id: 1,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'To reset your password: 1. Go to the login page 2. Click "Forgot Password" 3. Enter your email address 4. Check your email for reset instructions 5. Follow the link in the email to create a new password',
      keywords: ['password', 'reset', 'forgot', 'login', 'account'],
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      category: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by location: Standard shipping (5-7 business days), Express shipping (2-3 business days), Overnight shipping (1 business day). International orders may take 7-14 business days.',
      keywords: ['shipping', 'delivery', 'time', 'how long'],
      is_active: true,
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-16T09:15:00Z'
    },
    {
      id: 3,
      category: 'product',
      question: 'What is your return policy?',
      answer: 'Our return policy allows returns within 30 days of purchase. Items must be in original condition with tags attached. To initiate a return, contact customer service or visit our returns portal.',
      keywords: ['return', 'refund', 'policy', 'exchange'],
      is_active: true,
      created_at: '2024-01-13T16:45:00Z',
      updated_at: '2024-01-13T16:45:00Z'
    },
    {
      id: 4,
      category: 'billing',
      question: 'How do I update my payment method?',
      answer: 'To update your payment method: 1. Log into your account 2. Go to Account Settings 3. Select Payment Methods 4. Add a new card or update existing information 5. Save your changes',
      keywords: ['payment', 'billing', 'card', 'update', 'method'],
      is_active: true,
      created_at: '2024-01-12T11:30:00Z',
      updated_at: '2024-01-17T13:22:00Z'
    },
    {
      id: 5,
      category: 'technical',
      question: 'The app is not working properly',
      answer: 'If you\'re experiencing app issues: 1. Try closing and reopening the app 2. Check for app updates 3. Restart your device 4. Clear the app cache 5. If problems persist, contact technical support',
      keywords: ['app', 'technical', 'bug', 'not working', 'issue'],
      is_active: true,
      created_at: '2024-01-11T08:15:00Z',
      updated_at: '2024-01-11T08:15:00Z'
    }
  ];

  const categories = ['all', 'account', 'shipping', 'product', 'billing', 'technical'];

  // Filter entries based on search and category
  const filteredEntries = knowledgeEntries.filter(entry => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      entry.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch && entry.is_active;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'account': return 'text-blue-400 bg-blue-500/20';
      case 'shipping': return 'text-purple-400 bg-purple-500/20';
      case 'product': return 'text-green-400 bg-green-500/20';
      case 'billing': return 'text-yellow-400 bg-yellow-500/20';
      case 'technical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          <p className="text-gray-400">
            Manage AI knowledge base entries and responses
          </p>
        </div>
        
        <motion.button
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Entry
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{knowledgeEntries.length}</div>
          <div className="text-sm text-gray-400">Total Entries</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{knowledgeEntries.filter(e => e.is_active).length}</div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{categories.length - 1}</div>
          <div className="text-sm text-gray-400">Categories</div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">94%</div>
          <div className="text-sm text-gray-400">Coverage</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Knowledge Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">No entries found</h3>
            <p className="text-gray-400">
              {knowledgeEntries.length === 0 
                ? "No knowledge base entries available." 
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => setSelectedEntry(entry)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Entry Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(entry.category)}`}>
                    {entry.category.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">ID: #{entry.id}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(entry.updated_at)}
                </span>
              </div>

              {/* Question */}
              <h3 className="text-white font-medium mb-2 line-clamp-2">
                {entry.question}
              </h3>
              
              {/* Answer Preview */}
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {entry.answer}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1 mb-3">
                {entry.keywords.slice(0, 4).map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                  >
                    {keyword}
                  </span>
                ))}
                {entry.keywords.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                    +{entry.keywords.length - 4} more
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedEntry(null);
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(selectedEntry.category)}`}>
                    {selectedEntry.category.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">ID: #{selectedEntry.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white">Knowledge Entry</h2>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Question */}
              <div>
                <label className="text-sm font-medium text-gray-400">Question</label>
                <p className="text-white mt-1 text-lg">{selectedEntry.question}</p>
              </div>

              {/* Answer */}
              <div>
                <label className="text-sm font-medium text-gray-400">Answer</label>
                <div className="bg-gray-800 rounded-lg p-4 mt-1">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {selectedEntry.answer}
                  </p>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="text-sm font-medium text-gray-400">Keywords</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEntry.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedEntry.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Last Updated</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedEntry.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Edit Entry
              </button>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 