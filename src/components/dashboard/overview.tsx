'use client'

// 📊 DASHBOARD OVERVIEW
// Main dashboard page with analytics, charts, and insights

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Ticket, 
  Bot, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react'
import { MetricCard } from './metric-card'
import { AnalyticsChart } from './analytics-chart'
import { RecentTickets } from './recent-tickets'
import { AIInsights } from './ai-insights'
import { QuickActions } from './quick-actions'
import { LoadingSpinner } from '../ui/loading-spinner'
import { 
  useDashboardStats, 
  useDashboardAnalytics, 
  useRecentTickets,
  useSystemHealth,
  useEmailStats
} from '@/hooks/api-hooks'

export function DashboardOverview() {
  // Fetch real data using hooks
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: analyticsData, isLoading: analyticsLoading } = useDashboardAnalytics(7)
  const { data: recentTickets, isLoading: ticketsLoading } = useRecentTickets(5)
  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth()
  const { data: emailStats, isLoading: emailStatsLoading } = useEmailStats()

  // Loading state for initial data
  const isLoading = statsLoading || analyticsLoading || ticketsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard data..." />
      </div>
    )
  }

  // Error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--dark-text-primary)] mb-2">
            Failed to load dashboard data
          </h3>
          <p className="text-[var(--dark-text-muted)] mb-4">
            Unable to connect to the backend API. Please make sure the server is running.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gradient-text">
          Welcome back, Admin! 👋
        </h1>
        <p className="text-[var(--dark-text-muted)] mt-2">
          Here's what's happening with your AI support system today.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <QuickActions />
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricCard
          title="Total Tickets"
          value={dashboardStats?.total_tickets?.toLocaleString() || '0'}
          change={{ value: 12, type: 'increase', period: 'vs last week' }}
          icon={Ticket}
          color="blue"
        />
        
        <MetricCard
          title="Open Tickets"
          value={dashboardStats?.open_tickets || 0}
          change={{ value: 8, type: 'decrease', period: 'vs yesterday' }}
          icon={AlertCircle}
          color="orange"
        />
        
        <MetricCard
          title="AI Success Rate"
          value={`${dashboardStats?.ai_success_rate || 0}%`}
          change={{ value: 4, type: 'increase', period: 'vs last month' }}
          icon={Bot}
          color="green"
        />
        
        <MetricCard
          title="Avg Resolution"
          value={`${dashboardStats?.avg_resolution_time || 0}h`}
          change={{ value: 15, type: 'decrease', period: 'vs last week' }}
          icon={Clock}
          color="purple"
        />
      </motion.div>

              {/* Charts and Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <AnalyticsChart data={analyticsData || []} loading={analyticsLoading} />
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AIInsights />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentTickets tickets={recentTickets || []} loading={ticketsLoading} />
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className={`h-5 w-5 ${
              systemHealth?.status === 'healthy' ? 'text-green-400' : 
              systemHealth?.status === 'degraded' ? 'text-yellow-400' : 
              'text-red-400'
            }`} />
            <h3 className="text-lg font-semibold text-[var(--dark-text-primary)]">
              System Status
            </h3>
            {healthLoading && (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          <div className="space-y-4">
            {systemHealth?.services?.map((service) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    service.status === 'operational' ? 'bg-green-400' :
                    service.status === 'degraded' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`} />
                  <span className="text-sm font-medium text-[var(--dark-text-primary)]">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--dark-text-muted)]">
                    {service.uptime}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    service.status === 'operational' ? 'bg-green-500/20 text-green-400' :
                    service.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            )) || (
              // Fallback when no system health data
              <div className="text-center py-4">
                <p className="text-sm text-[var(--dark-text-muted)]">
                  System status unavailable
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-blue-400">
                  Live Connection
                </p>
                <p className="text-xs text-[var(--dark-text-muted)] mt-1">
                  Dashboard is connected to your backend API server
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--dark-text-primary)]">
            Today's Performance Summary
          </h3>
          {emailStatsLoading && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {emailStats?.today_processed || dashboardStats?.emails_processed_today || 0}
            </div>
            <div className="text-sm text-[var(--dark-text-muted)]">Emails Processed</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {dashboardStats?.knowledge_base_hits || 0}
            </div>
            <div className="text-sm text-[var(--dark-text-muted)]">KB Searches</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {dashboardStats?.customer_satisfaction || 0}
            </div>
            <div className="text-sm text-[var(--dark-text-muted)]">Satisfaction</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {dashboardStats?.resolved_tickets || 0}
            </div>
            <div className="text-sm text-[var(--dark-text-muted)]">Resolved Total</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 