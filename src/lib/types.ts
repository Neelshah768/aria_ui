// 🏷️ TYPE DEFINITIONS
// TypeScript interfaces for the AI Support Dashboard

export interface Ticket {
  id: number
  customer_id: number
  customer_email: string
  subject: string
  original_message: string
  ai_response?: string
  status: 'new' | 'open' | 'processed' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: string
  sentiment?: string
  message_id?: string
  thread_id?: string
  created_at: string
  updated_at: string
  
  // Joined fields (optional)
  customer_name?: string
  assigned_to_name?: string
}

export interface Customer {
  id: number
  email: string
  name?: string
  phone?: string
  company?: string
  subscription_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: number
  direction: string
  from_email: string
  to_email: string
  subject: string
  processed_at: string
  error_message?: string
  status: string
  
  // Joined fields
  customer_email?: string
  customer_name?: string
}

export interface KnowledgeBase {
  id: number
  category: string
  subcategory?: string
  title: string
  question: string
  solution: string
  keywords: string[]
  department: string
  priority: number
  usage_count: number
  last_used?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_tickets: number
  open_tickets: number
  resolved_tickets: number
  avg_resolution_time: number
  customer_satisfaction: number
  ai_success_rate: number
  emails_processed_today: number
  knowledge_base_hits: number
}

export interface AnalyticsData {
  name?: string // For chart display (e.g., 'Mon', 'Tue', 'Wed')
  date: string
  tickets: number // Total tickets (for chart compatibility)
  tickets_created?: number
  tickets_resolved?: number
  resolved?: number // For chart compatibility
  emails_processed: number
  ai_solved: number // For chart compatibility  
  ai_solved_completely: number
  ai_solved_partially: number
  ai_failed: number
  avg_response_time: number
  avg_resolution_time: number
  satisfaction_score: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
  category?: string
  [key: string]: any
}

export interface Department {
  name: string
  slug: string
  description: string
  ticket_count: number
  avg_resolution_time: number
  satisfaction_score: number
}

export interface FilterOptions {
  status?: Ticket['status'][]
  priority?: Ticket['priority'][]
  department?: string[]
  date_range?: {
    start: string
    end: string
  }
  tags?: string[]
  search?: string
}

export interface SortOption {
  field: keyof Ticket
  direction: 'asc' | 'desc'
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: PaginationInfo
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'agent' | 'viewer'
  avatar?: string
  last_login?: string
  is_active: boolean
}

export interface NotificationPreferences {
  email_notifications: boolean
  desktop_notifications: boolean
  sound_enabled: boolean
  notification_types: {
    new_tickets: boolean
    ticket_updates: boolean
    high_priority: boolean
    system_alerts: boolean
  }
}

export interface Settings {
  auto_refresh_interval: number
  default_filters: FilterOptions
  notifications: NotificationPreferences
  theme: 'dark' | 'light' | 'auto'
  sidebar_collapsed: boolean
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  description?: string
  duration?: number
}

// Mock data generators for development
export interface MockDataConfig {
  tickets?: number
  customers?: number
  emails?: number
  days?: number
}

// API endpoints configuration
export interface ApiEndpoints {
  tickets: string
  customers: string
  emails: string
  analytics: string
  knowledge: string
  stats: string
}

// Navigation items
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  children?: NavigationItem[]
}

// Chart configuration
export interface ChartConfig {
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut'
  data: ChartData[]
  xKey: string
  yKey: string
  colors?: string[]
  height?: number
}

export interface MetricCard {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  icon?: React.ComponentType<{ className?: string }>
  color?: string
}

// Form types
export interface TicketFormData {
  subject: string
  message: string
  priority: Ticket['priority']
  department: string
  customer_email: string
  tags: string[]
}

export interface KnowledgeFormData {
  title: string
  question: string
  solution: string
  category: string
  subcategory?: string
  keywords: string[]
  department: string
  priority: number
}

// Search and filter results
export interface SearchResults<T> {
  items: T[]
  total: number
  query: string
  filters: FilterOptions
  sort: SortOption
  pagination: PaginationInfo
} 