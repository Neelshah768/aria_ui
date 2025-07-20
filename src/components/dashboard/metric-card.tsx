'use client'

// 📈 METRIC CARD COMPONENT
// Animated cards showing key metrics with trend indicators

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
  className?: string
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-400'
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    text: 'text-green-400'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    text: 'text-purple-400'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
    text: 'text-orange-400'
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    text: 'text-red-400'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: 'text-yellow-400',
    text: 'text-yellow-400'
  }
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  className
}: MetricCardProps) {
  const colorConfig = colorVariants[color]

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-6',
        'hover:border-[var(--dark-border-light)] hover:shadow-xl hover:shadow-black/20',
        'transition-all duration-200 cursor-pointer',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          'p-3 rounded-lg',
          colorConfig.bg,
          colorConfig.border,
          'border'
        )}>
          <Icon className={cn('h-5 w-5', colorConfig.icon)} />
        </div>

        {/* Trend indicator */}
        {change && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
              change.type === 'increase' 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {change.type === 'increase' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{change.value}%</span>
          </motion.div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-[var(--dark-text-primary)]"
        >
          {value}
        </motion.h3>

        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--dark-text-secondary)]">
            {title}
          </p>

          {change && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-[var(--dark-text-muted)]"
            >
              {change.period}
            </motion.p>
          )}
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className={cn(
        'absolute inset-0 rounded-xl opacity-0 hover:opacity-5 transition-opacity duration-200',
        colorConfig.bg
      )} />
    </motion.div>
  )
} 