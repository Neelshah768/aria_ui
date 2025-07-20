'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '@/hooks/api-hooks';
import { Customer } from '@/lib/types';
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { data: customersResponse, isLoading, error, refetch } = useCustomers();

  // Extract customers array from API response
  const customers = customersResponse?.data || [];

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer: Customer) => {
    return customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.company?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'premium': return 'text-yellow-400';
      case 'basic': return 'text-blue-400';
      case 'enterprise': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Customers</h1>
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
          ❌ Error loading customers: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-gray-400">
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
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

      {/* Search */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Customers Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-white mb-2">No customers found</h3>
          <p className="text-gray-400">
            {customers?.length === 0 
              ? "No customers have been created yet." 
              : "Try adjusting your search query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCustomers.map((customer: Customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg p-4 cursor-pointer transition-all"
              onClick={() => setSelectedCustomer(customer)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Customer Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : customer.email.charAt(0).toUpperCase()}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
                <span className={`text-xs font-medium ${getSubscriptionColor(customer.subscription_type)}`}>
                  {customer.subscription_type?.toUpperCase() || 'BASIC'}
                </span>
              </div>

              {/* Customer Info */}
              <h3 className="text-white font-medium mb-1">
                {customer.name || 'Anonymous'}
              </h3>
              
              <p className="text-gray-400 text-sm mb-2">
                {customer.email}
              </p>

              {customer.company && (
                <p className="text-gray-500 text-xs mb-3">
                  🏢 {customer.company}
                </p>
              )}

              {/* Stats */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Joined {formatRelativeTime(customer.created_at)}</span>
                <span>ID: #{customer.id}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCustomer(null);
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : selectedCustomer.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedCustomer.name || 'Anonymous Customer'}
                  </h2>
                  <p className="text-gray-400">{selectedCustomer.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Status & Subscription */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs border mt-1 ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Subscription</label>
                  <div className={`text-sm font-medium mt-1 ${getSubscriptionColor(selectedCustomer.subscription_type)}`}>
                    {selectedCustomer.subscription_type?.toUpperCase() || 'BASIC'}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <p className="text-white mt-1">{selectedCustomer.email}</p>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">Phone</label>
                    <p className="text-white mt-1">{selectedCustomer.phone}</p>
                  </div>
                )}
              </div>

              {selectedCustomer.company && (
                <div>
                  <label className="text-sm font-medium text-gray-400">Company</label>
                  <p className="text-white mt-1">{selectedCustomer.company}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div>
                  <label className="text-sm font-medium text-gray-400">Created</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedCustomer.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Updated</label>
                  <p className="text-gray-300 text-sm">{formatDate(selectedCustomer.updated_at)}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400">#{selectedCustomer.id}</div>
                    <div className="text-xs text-gray-500">Customer ID</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      {formatRelativeTime(selectedCustomer.created_at)}
                    </div>
                    <div className="text-xs text-gray-500">Member Since</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                View Tickets
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 