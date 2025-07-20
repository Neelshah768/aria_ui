'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIQuery, useSystemHealth } from '@/hooks/api-hooks';
import { formatDate } from '@/lib/utils';

interface QueryResult {
  query: string;
  response: {
    canSolve: boolean | 'partial';
    department: string;
    needsTicket: boolean;
    message: string;
  };
  timestamp: string;
  success: boolean;
}

export default function AIAssistantPage() {
  const [query, setQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryResult[]>([]);
  const [isTestingQuery, setIsTestingQuery] = useState(false);
  
  const { data: systemHealth } = useSystemHealth();
  const aiQueryMutation = useAIQuery();

  // Sample queries for quick testing
  const sampleQueries = [
    'How do I reset my password?',
    'My order hasn\'t arrived yet',
    'I want to return a product',
    'How do I cancel my subscription?',
    'Where is my refund?',
    'The app is not working properly'
  ];

  const handleQuerySubmit = async (testQuery?: string) => {
    const queryText = testQuery || query;
    if (!queryText.trim()) return;

    setIsTestingQuery(true);
    
    try {
      const result = await aiQueryMutation.mutateAsync({ query: queryText });
      
      const queryResult: QueryResult = {
        query: queryText,
        response: result.response,
        timestamp: new Date().toISOString(),
        success: true
      };
      
      setQueryHistory(prev => [queryResult, ...prev]);
      setQuery('');
    } catch (error) {
      console.error('AI query failed:', error);
      
      const errorResult: QueryResult = {
        query: queryText,
        response: {
          canSolve: false,
          department: 'technical',
          needsTicket: true,
          message: 'Sorry, there was an error processing your query. Please try again.'
        },
        timestamp: new Date().toISOString(),
        success: false
      };
      
      setQueryHistory(prev => [errorResult, ...prev]);
    } finally {
      setIsTestingQuery(false);
    }
  };

  const getSolveStatusColor = (canSolve: boolean | 'partial') => {
    if (canSolve === true) return 'text-green-400 bg-green-500/20';
    if (canSolve === 'partial') return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getSolveStatusText = (canSolve: boolean | 'partial') => {
    if (canSolve === true) return 'Can Solve';
    if (canSolve === 'partial') return 'Partial';
    return 'Cannot Solve';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">🤖 AI Assistant</h1>
          <p className="text-gray-400 mt-2">
            Test AI responses and analyze query resolution capabilities
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {systemHealth && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                systemHealth.gemini_status === 'connected' 
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-400">
                Gemini {systemHealth.gemini_status === 'connected' ? 'Online' : 'Offline'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Query Input */}
      <motion.div
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Test AI Query</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Enter customer query:
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a customer question to test AI response..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
              disabled={isTestingQuery}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              onClick={() => handleQuerySubmit()}
              disabled={!query.trim() || isTestingQuery}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isTestingQuery ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                '🚀 Test Query'
              )}
            </motion.button>

            <button
              onClick={() => setQueryHistory([])}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              🗑️ Clear History
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sample Queries */}
      <motion.div
        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Quick Test Queries</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sampleQueries.map((sampleQuery, index) => (
            <motion.button
              key={index}
              onClick={() => handleQuerySubmit(sampleQuery)}
              disabled={isTestingQuery}
              className="p-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-left text-white rounded-lg transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              "{sampleQuery}"
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Query History */}
      {queryHistory.length > 0 && (
        <motion.div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Query History ({queryHistory.length})
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {queryHistory.map((result, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/50 border border-gray-600 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Query */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-blue-400">Query:</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(result.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-300 italic">"{result.query}"</p>
                </div>

                {/* Response Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      getSolveStatusColor(result.response.canSolve)
                    }`}>
                      {getSolveStatusText(result.response.canSolve)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Department:</span>
                    <span className="text-sm text-purple-400 capitalize">
                      {result.response.department}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Needs Ticket:</span>
                    <span className={`text-sm ${
                      result.response.needsTicket ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {result.response.needsTicket ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* AI Response */}
                <div>
                  <span className="text-sm font-medium text-green-400">AI Response:</span>
                  <div className="mt-1 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.response.message}
                    </p>
                  </div>
                </div>

                {/* Success indicator */}
                <div className="flex items-center gap-2 mt-3">
                  <div className={`w-2 h-2 rounded-full ${
                    result.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`text-xs ${
                    result.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.success ? 'Query processed successfully' : 'Query failed'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {queryHistory.length === 0 && !isTestingQuery && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Test AI</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Enter a customer query above or use one of the sample queries to test 
            how well the AI can understand and respond to customer inquiries.
          </p>
        </motion.div>
      )}
    </div>
  );
} 