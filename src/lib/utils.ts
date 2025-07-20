// 🛠️ UTILITY FUNCTIONS
// Shared utilities for the AI Support Dashboard

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

/**
 * Merge Tailwind classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display in dashboard
 */
export function formatDate(date: Date | string): string {
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'h:mm a')}`
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'h:mm a')}`
  }
  
  return format(dateObj, 'MMM d, yyyy \'at\' h:mm a')
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Format numbers for display (e.g., 1000 -> 1K)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format percentage with proper rounding
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  const percentage = (value / total) * 100
  return `${Math.round(percentage)}%`
}

/**
 * Get initials from name for avatar
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Generate a random color for avatars
 */
export function getRandomColor(seed: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500'
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Get status color for tickets
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'open':
      return 'text-blue-400 bg-blue-400/10'
    case 'in_progress':
      return 'text-yellow-400 bg-yellow-400/10'
    case 'resolved':
      return 'text-green-400 bg-green-400/10'
    case 'closed':
      return 'text-gray-400 bg-gray-400/10'
    default:
      return 'text-gray-400 bg-gray-400/10'
  }
}

/**
 * Get priority color for tickets
 */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'text-green-400'
    case 'medium':
      return 'text-yellow-400'
    case 'high':
      return 'text-orange-400'
    case 'urgent':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * Generate placeholder data for development
 */
export function generateMockData<T>(
  generator: () => T,
  count: number
): T[] {
  return Array.from({ length: count }, generator)
}

/**
 * Local storage helpers with type safety
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
} 