'use client'

// 🎯 HEADER COMPONENT
// Top navigation bar with search, notifications, and user menu

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  Zap,
  ChevronDown,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Header({ 
  sidebarOpen, 
  setSidebarOpen, 
  mobileMenuOpen, 
  setMobileMenuOpen 
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'New ticket received',
      message: 'Customer inquiry about order #1234',
      time: '2 min ago',
      type: 'ticket',
      unread: true,
    },
    {
      id: 2,
      title: 'AI resolved 5 tickets',
      message: 'Successfully handled customer inquiries',
      time: '15 min ago',
      type: 'success',
      unread: true,
    },
    {
      id: 3,
      title: 'High priority ticket',
      message: 'Urgent billing issue requires attention',
      time: '1 hour ago',
      type: 'urgent',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="bg-[var(--dark-bg-secondary)] border-b border-[var(--dark-border)] p-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--dark-bg-hover)] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>

          {/* Desktop sidebar toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 rounded-lg hover:bg-[var(--dark-bg-hover)] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </motion.button>

          {/* Search */}
          <div className="relative">
            <motion.div
              initial={false}
              animate={{ width: searchOpen ? 300 : 240 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--dark-text-muted)]" />
              <input
                type="text"
                placeholder="Search tickets, customers, or knowledge base..."
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 rounded-xl',
                  'bg-[var(--dark-bg-primary)] border border-[var(--dark-border)]',
                  'text-[var(--dark-text-primary)] placeholder:text-[var(--dark-text-muted)]',
                  'focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20',
                  'transition-all duration-200'
                )}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
              />
            </motion.div>

            {/* Search suggestions - would be populated dynamically */}
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl p-2 shadow-xl z-50"
              >
                <div className="text-sm text-[var(--dark-text-muted)] p-2">
                  Recent searches will appear here...
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl hover:bg-[var(--dark-bg-hover)] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {unreadCount}
                </motion.div>
              )}
            </motion.button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl shadow-xl z-50"
              >
                <div className="p-4 border-b border-[var(--dark-border)]">
                  <h3 className="font-semibold text-[var(--dark-text-primary)]">
                    Notifications
                  </h3>
                  <p className="text-sm text-[var(--dark-text-muted)]">
                    {unreadCount} unread notifications
                  </p>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ backgroundColor: 'var(--dark-bg-hover)' }}
                      className={cn(
                        'p-4 border-b border-[var(--dark-border)] last:border-b-0 cursor-pointer',
                        notification.unread && 'bg-blue-500/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full flex-shrink-0 mt-2',
                          notification.type === 'urgent' ? 'bg-red-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          'bg-blue-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--dark-text-primary)] text-sm">
                            {notification.title}
                          </p>
                          <p className="text-[var(--dark-text-muted)] text-xs mt-1">
                            {notification.message}
                          </p>
                          <p className="text-[var(--dark-text-muted)] text-xs mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-3 border-t border-[var(--dark-border)]">
                  <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--dark-bg-hover)] transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-[var(--dark-text-primary)]">
                  Admin User
                </p>
                <p className="text-xs text-[var(--dark-text-muted)]">
                  Online
                </p>
              </div>
              <ChevronDown className={cn(
                'h-4 w-4 text-[var(--dark-text-muted)] transition-transform duration-200',
                userMenuOpen && 'rotate-180'
              )} />
            </motion.button>

            {/* User dropdown */}
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full right-0 mt-2 w-56 bg-[var(--dark-bg-card)] border border-[var(--dark-border)] rounded-xl shadow-xl z-50"
              >
                <div className="p-3 border-b border-[var(--dark-border)]">
                  <p className="font-medium text-[var(--dark-text-primary)]">Admin User</p>
                  <p className="text-sm text-[var(--dark-text-muted)]">admin@support.ai</p>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--dark-bg-hover)] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--dark-bg-hover)] text-[var(--dark-text-secondary)] hover:text-[var(--dark-text-primary)] transition-colors">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-[var(--dark-border)]">
                  <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Sign out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(notificationsOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setNotificationsOpen(false)
            setUserMenuOpen(false)
          }}
        />
      )}
    </header>
  )
} 