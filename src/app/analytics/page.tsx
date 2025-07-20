'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Bot, Clock, BarChart } from 'lucide-react';
import { useDashboardAnalytics, useDashboardStats } from '@/hooks/api-hooks';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { MetricCard } from '@/components/dashboard/metric-card';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7);
  
  const { data: analytics, isLoading: analyticsLoading, refetch: refetchAnalytics } = useDashboardAnalytics(selectedPeriod);
  const { data: stats, isLoading: statsLoading } = useDashboardStats();

  const isLoading = analyticsLoading || statsLoading;

  // Calculate period-over-period changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock data for additional metrics
  const additionalMetrics = [
    {
      title: 'Response Time',
      value: '2.3s',
      change: -15,
      description: 'Average AI response time'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.6/5',
      change: 8,
      description: 'Average rating from customers'
    },
    {
      title: 'Resolution Rate',
      value: '87%',
      change: 12,
      description: 'First-contact resolution rate'
    },
    {
      title: 'Cost Savings',
      value: '$2,450',
      change: 23,
      description: 'Monthly operational savings'
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
        </div>
        
        {/* Loading Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">
            Detailed insights into your AI support system performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {([7, 14, 30] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {period}d
              </button>
            ))}
          </div>
          
          <motion.button
            onClick={() => refetchAnalytics()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Refresh
          </motion.button>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tickets"
          value={stats?.total_tickets.toString() || '0'}
          change={{ value: 12, type: 'increase', period: 'vs last week' }}
          icon={Ticket}
          color="blue"
        />
        <MetricCard
          title="AI Success Rate"
          value={`${stats?.ai_success_rate || 0}%`}
          change={{ value: 5, type: 'increase', period: 'vs last week' }}
          icon={Bot}
          color="green"
        />
        <MetricCard
          title="Open Tickets"
          value={stats?.open_tickets.toString() || '0'}
          change={{ value: 8, type: 'decrease', period: 'vs last week' }}
          icon={Ticket}
          color="orange"
        />
        <MetricCard
          title="Avg Resolution"
          value={`${stats?.avg_resolution_time || 0}h`}
          change={{ value: 15, type: 'decrease', period: 'vs last week' }}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {additionalMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={{ 
              value: Math.abs(metric.change), 
              type: metric.change >= 0 ? 'increase' : 'decrease',
              period: 'vs last month'
            }}
            icon={BarChart}
            color="blue"
          />
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Ticket Volume & AI Performance</h2>
          <span className="text-sm text-gray-400">Last {selectedPeriod} days</span>
        </div>
        
        <AnalyticsChart data={analytics || []} />
      </div>

      {/* Detailed Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Email Processing</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
                <span className="text-sm text-gray-400 w-10">92%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">AI Accuracy</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
                <span className="text-sm text-gray-400 w-10">87%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Response Speed</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
                <span className="text-sm text-gray-400 w-10">78%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">System Uptime</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '99%'}}></div>
                </div>
                <span className="text-sm text-gray-400 w-10">99%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Issues */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Common Issues</h3>
          <div className="space-y-3">
            {[
              { issue: 'Account password reset', count: 24, trend: 'up' },
              { issue: 'Order status inquiry', count: 18, trend: 'down' },
              { issue: 'Product information', count: 15, trend: 'stable' },
              { issue: 'Billing questions', count: 12, trend: 'up' },
              { issue: 'Technical support', count: 8, trend: 'down' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <div className="flex-1">
                  <span className="text-gray-300">{item.issue}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">{item.count} tickets</span>
                    <span className={`text-xs ${
                      item.trend === 'up' ? 'text-red-400' : 
                      item.trend === 'down' ? 'text-green-400' : 
                      'text-gray-400'
                    }`}>
                      {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🤖 AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="font-medium text-blue-300">Performance</span>
            </div>
            <p className="text-gray-300 text-sm">
              AI response accuracy increased by 12% this week. Consider updating knowledge base with successful responses.
            </p>
          </div>
          
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium text-green-300">Optimization</span>
            </div>
            <p className="text-gray-300 text-sm">
              Peak hours are 9-11 AM. Consider auto-scaling during these periods for better performance.
            </p>
          </div>
          
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="font-medium text-yellow-300">Alert</span>
            </div>
            <p className="text-gray-300 text-sm">
              High volume of password reset requests detected. Consider implementing self-service options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 