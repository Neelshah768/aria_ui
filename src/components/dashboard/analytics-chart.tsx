'use client'

// 📊 ANALYTICS CHART COMPONENT
// Interactive chart showing ticket trends and AI performance

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SkeletonLoader } from '../ui/loading-spinner'
import { AnalyticsData } from '@/lib/types'

interface AnalyticsChartProps {
  data: AnalyticsData[]
  loading?: boolean
}

export function AnalyticsChart({ data, loading }: AnalyticsChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--dark-text-primary)]">
            Weekly Performance
          </h3>
          <p className="text-sm text-[var(--dark-text-muted)]">
            Tickets and AI resolution trends
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-[var(--dark-text-secondary)]">Tickets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-[var(--dark-text-secondary)]">Resolved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-[var(--dark-text-secondary)]">AI Solved</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        {loading ? (
          <div className="space-y-3">
            <SkeletonLoader lines={8} width="full" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[var(--dark-text-muted)] mb-2">No data available</p>
              <p className="text-xs text-[var(--dark-text-muted)]">
                Data will appear once your backend is connected
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dark-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--dark-text-muted)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--dark-text-muted)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--dark-bg-card)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--dark-text-primary)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tickets" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
              <Line 
                type="monotone" 
                dataKey="ai_solved" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  )
} 