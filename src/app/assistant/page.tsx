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
        success: result.success
      };
      
      setQueryHistory([queryResult, ...queryHistory]);
      
      if (!testQuery) {
        setQuery('');
      }
    } catch (error) {
      console.error('Query failed:', error);
      
      const failedResult: QueryResult = {
        query: queryText,
        response: {
          canSolve: false,
          department: 'error',
          needsTicket: true,
          message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        timestamp: new Date().toISOString(),
        success: false
      };
      
      setQueryHistory([failedResult, ...queryHistory]);
    } finally {
      setIsTestingQuery(false);
    }
  };

  const getSolutionColor = (canSolve: boolean | 'partial') => {
    if (canSolve === true) return 'text-green-400 bg-green-500/20 border-green-500/30';
    if (canSolve === 'partial') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    return 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getSolutionText = (canSolve: boolean | 'partial') => {
    if (canSolve === true) return 'Solved';
    if (canSolve === 'partial') return 'Partial';
    return 'Needs Ticket';
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'account': return 'text-blue-400';
      case 'shipping': return 'text-purple-400';
      case 'product': return 'text-green-400';
      case 'billing': return 'text-yellow-400';
      case 'technical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const clearHistory = () => {
    setQueryHistory([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="text-gray-400">
            Test AI responses and monitor assistant performance
          </p>
        </div>
        
        {/* AI Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            systemHealth?.services?.find(s => s.name === 'AI Assistant')?.status === 'operational'
              ? 'bg-green-400'
              : 'bg-red-400'
          }`}></div>
          <span className="text-sm text-gray-400">
            {systemHealth?.services?.find(s => s.name === 'AI Assistant')?.status === 'operational'
              ? 'AI Online'
              : 'AI Offline'}
          </span>
        </div>
      </div>

      {/* Query Testing Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Query Input */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Test AI Query</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter a customer support query to test..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              
              <motion.button
                onClick={() => handleQuerySubmit()}
                disabled={!query.trim() || isTestingQuery}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                  query.trim() && !isTestingQuery
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={query.trim() && !isTestingQuery ? { scale: 1.02 } : {}}
                whileTap={query.trim() && !isTestingQuery ? { scale: 0.98 } : {}}
              >
                {isTestingQuery ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Test Query 🤖'
                )}
              </motion.button>
            </div>
          </div>

          {/* Sample Queries */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Test Queries</h3>
            <div className="space-y-2">
              {sampleQueries.map((sampleQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleQuerySubmit(sampleQuery)}
                  disabled={isTestingQuery}
                  className="w-full text-left px-3 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-gray-300 transition-colors disabled:opacity-50"
                >
                  {sampleQuery}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Query History */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Query History</h2>
            {queryHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear History
              </button>
            )}
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {queryHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">🤖</div>
                <p>No queries tested yet</p>
                <p className="text-sm">Try testing a query to see AI responses</p>
              </div>
            ) : (
              queryHistory.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-900 border rounded-lg p-4 ${
                    result.success ? 'border-gray-700' : 'border-red-500/30'
                  }`}
                >
                  {/* Query */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">QUERY</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(result.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300 font-medium">{result.query}</p>
                  </div>

                  {/* Response */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSolutionColor(result.response.canSolve)}`}>
                        {getSolutionText(result.response.canSolve)}
                      </span>
                      <span className={`text-sm font-medium ${getDepartmentColor(result.response.department)}`}>
                        {result.response.department?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      {result.response.needsTicket && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          TICKET REQUIRED
                        </span>
                      )}
                    </div>
                    
                    <div className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-red-900/20 border-red-500/30'
                    }`}>
                      <p className={`text-sm ${result.success ? 'text-gray-300' : 'text-red-300'}`}>
                        {result.response.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Performance Stats */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AI Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">87%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">2.3s</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">1,247</div>
            <div className="text-sm text-gray-400">Queries Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">94%</div>
            <div className="text-sm text-gray-400">Knowledge Coverage</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      {systemHealth && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {systemHealth.services?.map((service, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-gray-300">{service.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    service.status === 'operational' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : service.status === 'limited'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {service.status}
                  </span>
                  <span className="text-xs text-gray-500">{service.uptime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 