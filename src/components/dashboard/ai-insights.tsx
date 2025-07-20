'use client'

// 🤖 AI INSIGHTS COMPONENT
// Smart insights and recommendations from AI analysis

import { motion } from 'framer-motion'
import { Brain, TrendingUp, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react'

const insights = [
  {
    type: 'success',
    icon: CheckCircle,
    title: 'High AI Performance',
    message: 'AI successfully resolved 87% of tickets this week',
    action: 'View details',
    color: 'text-green-400'
  },
  {
    type: 'improvement',
    icon: Lightbulb,
    title: 'Knowledge Gap Found',
    message: 'Consider adding solutions for "shipping delays" queries',
    action: 'Add knowledge',
    color: 'text-yellow-400'
  },
  {
    type: 'trend',
    icon: TrendingUp,
    title: 'Peak Hours Identified',
    message: 'Most tickets arrive between 9-11 AM',
    action: 'Optimize resources',
    color: 'text-blue-400'
  },
  {
    type: 'alert',
    icon: AlertTriangle,
    title: 'Response Time Alert',
    message: 'Avg response time increased by 12% this week',
    action: 'Investigate',
    color: 'text-orange-400'
  }
]

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--dark-text-primary)]">
            AI Insights
          </h3>
          <p className="text-sm text-[var(--dark-text-muted)]">
            Smart recommendations
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="group p-4 rounded-lg hover:bg-[var(--dark-bg-hover)] transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <insight.icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--dark-text-primary)] mb-1">
                  {insight.title}
                </p>
                <p className="text-xs text-[var(--dark-text-muted)] leading-relaxed">
                  {insight.message}
                </p>
                <button className="text-xs text-blue-400 hover:text-blue-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {insight.action} →
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-400">Live Analysis</span>
        </div>
        <p className="text-xs text-[var(--dark-text-muted)]">
          AI is continuously analyzing patterns to improve support efficiency
        </p>
      </div>
    </motion.div>
  )
} 