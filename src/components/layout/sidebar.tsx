'use client'

// 🔧 SIDEBAR NAVIGATION
// Collapsible sidebar with animated navigation items

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  Home,
  Mail,
  MessageSquare,
  Settings,
  Ticket,
  Users,
  Zap,
  Brain,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavigationItem } from '@/lib/types'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

// Navigation items configuration
const navigationItems: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/',
    icon: Home,
  },
  {
    name: 'Landing Page',
    href: '/landing',
    icon: Sparkles,
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: Ticket,
    badge: 12,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    name: 'Email Logs',
    href: '/emails',
    icon: Mail,
  },
  {
    name: 'Knowledge Base',
    href: '/knowledge',
    icon: Brain,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Bot,
  },
]

const bottomItems: NavigationItem[] = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar({ open, setOpen, mobileMenuOpen, setMobileMenuOpen }: SidebarProps) {
  const pathname = usePathname()
  
  // Animation variants
  const sidebarVariants = {
    open: {
      width: 280,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      width: 80,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const mobileSidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const textVariants = {
    open: {
      opacity: 1,
      width: 'auto',
      transition: { delay: 0.1, duration: 0.2 },
    },
    closed: {
      opacity: 0,
      width: 0,
      transition: { duration: 0.1 },
    },
  }

  const logoVariants = {
    open: {
      scale: 1,
      transition: { delay: 0.1, duration: 0.2 },
    },
    closed: {
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  }

  const NavigationLink = ({ item, collapsed = false }: { item: NavigationItem; collapsed?: boolean }) => {
    const isActive = pathname === item.href
    
    return (
      <Link href={item.href}>
        <motion.div
          whileHover={{ x: collapsed ? 0 : 4, scale: collapsed ? 1.05 : 1 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
            'hover:bg-[var(--dark-bg-hover)] hover:text-[var(--dark-text-primary)]',
            collapsed ? 'justify-center' : 'justify-start',
            isActive
              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 border-r-2 border-blue-500'
              : 'text-[var(--dark-text-secondary)]'
          )}
        >
          {/* Icon */}
          <motion.div
            animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'flex-shrink-0',
              isActive ? 'text-blue-400' : 'text-[var(--dark-text-muted)]',
              'group-hover:text-[var(--dark-text-primary)]'
            )}
          >
            <item.icon className="h-5 w-5" />
          </motion.div>

          {/* Text and badge */}
          {!collapsed && (
            <motion.div
              variants={textVariants}
              animate={open ? 'open' : 'closed'}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <span className="truncate">{item.name}</span>
              
              {/* Badge */}
              {item.badge && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs text-red-400"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--dark-bg-card)] text-[var(--dark-text-primary)] text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-[var(--dark-border)]">
              {item.name}
              {item.badge && (
                <span className="ml-1 px-1 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                  {item.badge}
                </span>
              )}
            </div>
          )}

          {/* Active indicator */}
          {isActive && !collapsed && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r"
            />
          )}
        </motion.div>
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        animate={open ? 'open' : 'closed'}
        className="hidden lg:flex flex-col bg-[var(--dark-bg-secondary)] border-r border-[var(--dark-border)] relative"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--dark-border)]">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              animate={open ? 'open' : 'closed'}
              className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>

            {/* Title */}
            <motion.div
              variants={textVariants}
              animate={open ? 'open' : 'closed'}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-bold gradient-text whitespace-nowrap">
                ARIA
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavigationLink key={item.name} item={item} collapsed={!open} />
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-[var(--dark-border)] space-y-1">
          {bottomItems.map((item) => (
            <NavigationLink key={item.name} item={item} collapsed={!open} />
          ))}

          {/* User profile */}
          <motion.div
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--dark-bg-hover)] transition-colors',
              open ? 'justify-start' : 'justify-center'
            )}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              AS
            </div>
            
            {open && (
              <motion.div
                variants={textVariants}
                animate={open ? 'open' : 'closed'}
                className="flex-1 overflow-hidden"
              >
                <p className="text-sm font-medium text-[var(--dark-text-primary)] truncate">
                  Admin User
                </p>
                <p className="text-xs text-[var(--dark-text-muted)] truncate">
                  admin@support.ai
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Toggle button */}
        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute -right-3 top-8 w-6 h-6 bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-full flex items-center justify-center text-[var(--dark-text-muted)] hover:text-[var(--dark-text-primary)] hover:border-[var(--dark-border-light)] transition-all duration-200"
        >
          {open ? (
            <ChevronLeft className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </motion.button>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        variants={mobileSidebarVariants}
        animate={mobileMenuOpen ? 'open' : 'closed'}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--dark-bg-secondary)] border-r border-[var(--dark-border)] lg:hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--dark-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold gradient-text">AI Support</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <div key={item.name} onClick={() => setMobileMenuOpen(false)}>
              <NavigationLink item={item} />
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-[var(--dark-border)] space-y-1">
          {bottomItems.map((item) => (
            <div key={item.name} onClick={() => setMobileMenuOpen(false)}>
              <NavigationLink item={item} />
            </div>
          ))}
        </div>
      </motion.div>
    </>
  )
} 