'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchDocuments } from '@/hooks/api-hooks';
import { DocumentSearchResult } from '@/lib/types';

interface DocumentSearchProps {
  clientId?: string;
  onResultSelect?: (result: DocumentSearchResult) => void;
}

export default function DocumentSearch({ 
  clientId, 
  onResultSelect
}: DocumentSearchProps) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'hybrid' | 'vector' | 'keyword'>('hybrid');
  const [results, setResults] = useState<DocumentSearchResult[]>([]);
  const [searchMetadata, setSearchMetadata] = useState<any>(null);

  const searchDocuments = useSearchDocuments();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await searchDocuments.mutateAsync({
        query: query.trim(),
        options: {
          limit: 20,
          searchType,
          clientId
        }
      });

      setResults(response.results);
      setSearchMetadata(response.metadata);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSearchMetadata(null);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-400">
          {part}
        </mark>
      ) : part
    );
  };

  const getResultTypeIcon = (type: string) => {
    switch (type) {
      case 'document_chunk': return '📄';
      case 'knowledge_entry': return '💡';
      default: return '📎';
    }
  };

  const getResultTypeColor = (type: string) => {
    switch (type) {
      case 'document_chunk': return 'text-blue-400 bg-blue-500/20';
      case 'knowledge_entry': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your knowledge base..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="hybrid">Hybrid Search</option>
            <option value="vector">Semantic Search</option>
            <option value="keyword">Keyword Search</option>
          </select>
          
          <motion.button
            type="submit"
            disabled={!query.trim() || searchDocuments.isPending}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {searchDocuments.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </div>
            ) : (
              '🔍 Search'
            )}
          </motion.button>
        </div>

        {/* Search Type Description */}
        <div className="text-xs text-gray-400">
          {searchType === 'hybrid' && '🎯 Combines semantic understanding with keyword matching for best results'}
          {searchType === 'vector' && '🧠 Uses AI to understand meaning and context, finds conceptually similar content'}
          {searchType === 'keyword' && '🔤 Traditional keyword-based search, finds exact text matches'}
        </div>
      </form>

      {/* Search Results */}
      {searchMetadata && (
        <div className="border-t border-gray-700 pt-6">
          {/* Search Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">
              Found {searchMetadata.totalResults} results in {searchMetadata.searchDurationMs}ms
            </div>
            <div className="text-xs text-gray-500">
              Search type: {searchMetadata.searchType}
            </div>
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400">
                Try adjusting your search query or upload more documents to expand your knowledge base.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={`${result.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => onResultSelect?.(result)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Result Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg flex-shrink-0">
                          {getResultTypeIcon(result.result_type)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getResultTypeColor(result.result_type)}`}>
                          {result.result_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <h3 className="font-medium text-white truncate">
                          {result.title}
                        </h3>
                      </div>

                      {/* Source Information */}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span>📁 {result.source}</span>
                        {result.document_title && (
                          <span>📄 {result.document_title}</span>
                        )}
                        {result.original_filename && (
                          <span>🗂️ {result.original_filename}</span>
                        )}
                        {result.page_number && (
                          <span>📄 Page {result.page_number}</span>
                        )}
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gray-900/50 rounded-lg p-3 mb-2">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {highlightText(result.content, query)}
                        </p>
                      </div>
                    </div>

                    {/* Relevance Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-gray-400 mb-1">Relevance</div>
                      <div className={`text-lg font-bold ${
                        result.relevanceScore > 0.8 
                          ? 'text-green-400' 
                          : result.relevanceScore > 0.6 
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }`}>
                        {Math.round(result.relevanceScore * 100)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Tips */}
      {!searchMetadata && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/30 border border-gray-700 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-white mb-2">💡 Search Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• <strong>Hybrid Search:</strong> Best overall results, combines AI understanding with keyword matching</li>
            <li>• <strong>Semantic Search:</strong> Great for concepts and ideas, finds related content even with different wording</li>
            <li>• <strong>Keyword Search:</strong> Perfect for exact terms, names, or specific phrases</li>
            <li>• Use natural language queries like "How do I reset password?" or "refund policy"</li>
            <li>• Search works across all your uploaded documents and knowledge base entries</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
} 