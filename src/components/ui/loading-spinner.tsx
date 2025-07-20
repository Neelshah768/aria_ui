'use client'

// ⏳ LOADING SPINNER COMPONENT
// Reusable loading indicator with size variants and text

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  color?: 'primary' | 'secondary' | 'white'
}

const sizeVariants = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const colorVariants = {
  primary: 'text-blue-400',
  secondary: 'text-[var(--dark-text-secondary)]',
  white: 'text-white'
}

const textSizeVariants = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className,
  color = 'primary' 
}: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        className
      )}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Loader2 className={cn(
          sizeVariants[size],
          colorVariants[color]
        )} />
      </motion.div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'font-medium',
            textSizeVariants[size],
            color === 'white' ? 'text-white' : 'text-[var(--dark-text-secondary)]'
          )}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  )
}

// Inline loading spinner for buttons and small spaces
export function InlineSpinner({ 
  size = 'sm',
  className 
}: { 
  size?: 'sm' | 'md' 
  className?: string 
}) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={className}
    >
      <Loader2 className={cn(
        size === 'sm' ? 'h-3 w-3' : 'h-4 w-4',
        'text-current'
      )} />
    </motion.div>
  )
}

// Skeleton loader for content placeholders
export function SkeletonLoader({ 
  className,
  lines = 1,
  width = 'full'
}: {
  className?: string
  lines?: number
  width?: 'full' | 'half' | 'quarter' | 'three-quarter'
}) {
  const widthVariants = {
    full: 'w-full',
    half: 'w-1/2',
    quarter: 'w-1/4',
    'three-quarter': 'w-3/4'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <motion.div
          key={i}
          className={cn(
            'h-4 bg-[var(--dark-bg-hover)] rounded animate-pulse',
            widthVariants[width],
            i === lines - 1 && lines > 1 && 'w-2/3' // Last line shorter
          )}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}

// Loading overlay for entire sections
export function LoadingOverlay({ 
  text = 'Loading...',
  className 
}: {
  text?: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'absolute inset-0 bg-[var(--dark-bg-primary)]/80 backdrop-blur-sm',
        'flex items-center justify-center z-50',
        className
      )}
    >
      <LoadingSpinner size="lg" text={text} />
    </motion.div>
  )
} 