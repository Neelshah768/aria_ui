'use client'

// 🎫 RECENT TICKETS COMPONENT
// Display latest support tickets with status and priority indicators

import { motion } from 'framer-motion'
import { Ticket as TicketIcon, Clock, User, Bot, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'
import { getStatusColor, getPriorityColor, formatRelativeTime } from '@/lib/utils'
import { Ticket } from '@/lib/types'
import { SkeletonLoader } from '../ui/loading-spinner'

interface RecentTicketsProps {
  tickets: Ticket[]
  loading?: boolean
}

export function RecentTickets({ tickets, loading }: RecentTicketsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return CheckCircle
      case 'open':
        return AlertCircle
      default:
        return Clock
    }
  }

  const getPriorityDot = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <TicketIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--dark-text-primary)]">
              Recent Tickets
            </h3>
            <p className="text-sm text-[var(--dark-text-muted)]">
              Latest support requests
            </p>
          </div>
        </div>
        
        <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-[var(--dark-border)]">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-16 bg-gray-600 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonLoader lines={1} width="quarter" />
                    <SkeletonLoader lines={1} width="three-quarter" />
                    <SkeletonLoader lines={1} width="half" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-8">
            <TicketIcon className="h-8 w-8 text-[var(--dark-text-muted)] mx-auto mb-3" />
            <p className="text-[var(--dark-text-muted)] mb-2">No recent tickets</p>
            <p className="text-xs text-[var(--dark-text-muted)]">
              Tickets will appear here once your backend is connected
            </p>
          </div>
        ) : (
          tickets.map((ticket, index) => {
          const StatusIcon = getStatusIcon(ticket.status)
          
          return (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="group p-4 rounded-lg hover:bg-[var(--dark-bg-hover)] transition-all duration-200 cursor-pointer border border-transparent hover:border-[var(--dark-border-light)]"
            >
              <div className="flex items-start gap-3">
                {/* Priority indicator */}
                <div className={`w-1 h-16 rounded-full ${getPriorityDot(ticket.priority)} flex-shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--dark-text-primary)]">
                        #{ticket.id}
                      </span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        <StatusIcon className="h-3 w-3" />
                        {ticket.status.replace('_', ' ')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {ticket.ai_response && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                          <Bot className="h-3 w-3" />
                          AI
                        </div>
                      )}
                      <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  <p className="text-sm font-medium text-[var(--dark-text-primary)] mb-2 group-hover:text-blue-400 transition-colors">
                    {ticket.subject}
                  </p>

                  {/* Customer and time */}
                  <div className="flex items-center justify-between text-xs text-[var(--dark-text-muted)]">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {ticket.customer_email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatRelativeTime(ticket.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
          })
        )}
      </div>

      <div className="mt-6 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-green-400 font-medium">System Status:</span>
          <span className="text-[var(--dark-text-muted)]">Processing emails normally</span>
        </div>
      </div>
    </motion.div>
  )
} 