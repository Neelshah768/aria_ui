'use client'

// ⚡ QUICK ACTIONS COMPONENT
// Quick access buttons for common dashboard actions

import { motion } from 'framer-motion'
import { Plus, Search, Settings, Download, RefreshCw, Brain } from 'lucide-react'
import toast from 'react-hot-toast'

const quickActions = [
  {
    name: 'New Ticket',
    description: 'Create a ticket manually',
    icon: Plus,
    color: 'bg-blue-500 hover:bg-blue-600',
    action: () => toast.success('Opening new ticket form...')
  },
  {
    name: 'Search KB',
    description: 'Search knowledge base',
    icon: Search,
    color: 'bg-purple-500 hover:bg-purple-600',
    action: () => toast.success('Opening knowledge base search...')
  },
  {
    name: 'AI Assistant',
    description: 'Test AI responses',
    icon: Brain,
    color: 'bg-green-500 hover:bg-green-600',
    action: () => toast.success('Opening AI assistant...')
  },
  {
    name: 'Export Data',
    description: 'Download reports',
    icon: Download,
    color: 'bg-orange-500 hover:bg-orange-600',
    action: () => toast.success('Preparing export...')
  },
  {
    name: 'Refresh Data',
    description: 'Sync latest data',
    icon: RefreshCw,
    color: 'bg-teal-500 hover:bg-teal-600',
    action: () => toast.success('Refreshing dashboard...')
  },
  {
    name: 'Settings',
    description: 'Configure system',
    icon: Settings,
    color: 'bg-gray-500 hover:bg-gray-600',
    action: () => toast.success('Opening settings...')
  }
]

export function QuickActions() {
  return (
    <div className="bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[var(--dark-text-primary)] mb-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`
              ${action.color} text-white rounded-lg p-4 
              transition-all duration-200 
              flex flex-col items-center gap-2
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            `}
          >
            <action.icon className="h-5 w-5" />
            <div className="text-center">
              <p className="text-sm font-medium">{action.name}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
} 