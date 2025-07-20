// 🌐 API CLIENT
// Central API communication layer for backend integration

import axios from 'axios'
import toast from 'react-hot-toast'
import { ApiResponse, Ticket, Customer, EmailLog, DashboardStats, AnalyticsData } from './types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth and logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error)
    
    // Handle different error types
    if (error.response) {
      // Server error response
      const message = error.response.data?.error || error.response.data?.message || 'Server error occurred'
      toast.error(`API Error: ${message}`)
    } else if (error.request) {
      // Network error
      toast.error('Network error - please check your connection')
    } else {
      // Other error
      toast.error('An unexpected error occurred')
    }
    
    return Promise.reject(error)
  }
)

// ==========================================
// DASHBOARD ANALYTICS API
// ==========================================

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient.get('/dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      // Return fallback data if API fails
      return {
        total_tickets: 0,
        open_tickets: 0,
        resolved_tickets: 0,
        avg_resolution_time: 0,
        customer_satisfaction: 0,
        ai_success_rate: 0,
        emails_processed_today: 0,
        knowledge_base_hits: 0,
      }
    }
  },

  // Get analytics data for charts
  getAnalytics: async (days: number = 7): Promise<AnalyticsData[]> => {
    try {
      const response = await apiClient.get(`/analytics?days=${days}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      return []
    }
  },
}

// ==========================================
// TICKETS API
// ==========================================

export const ticketsApi = {
  // Get all tickets with pagination and filters
  getTickets: async (params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
    search?: string
  }): Promise<Ticket[]> => {
    try {
      const response = await apiClient.get('/tickets', { params })
      // Backend returns { tickets: [...], pagination: {...} }
      // For now, just return the tickets array
      return response.data.tickets || []
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
      return []
    }
  },

  // Get ticket by ID
  getTicket: async (id: number): Promise<Ticket> => {
    try {
      const response = await apiClient.get(`/tickets/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get recent tickets for dashboard
  getRecentTickets: async (limit: number = 5): Promise<Ticket[]> => {
    try {
      const response = await apiClient.get(`/tickets/recent?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch recent tickets:', error)
      return []
    }
  },

  // Create new ticket
  createTicket: async (ticketData: {
    customerEmail: string
    subject: string
    message: string
    priority?: string
  }): Promise<Ticket> => {
    try {
      const response = await apiClient.post('/tickets', ticketData)
      toast.success('Ticket created successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update ticket status
  updateTicketStatus: async (id: number, status: string): Promise<Ticket> => {
    try {
      const response = await apiClient.patch(`/tickets/${id}/status`, { status })
      toast.success('Ticket updated successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// ==========================================
// CUSTOMERS API
// ==========================================

export const customersApi = {
  // Get all customers
  getCustomers: async (params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<Customer[]>> => {
    try {
      const response = await apiClient.get('/customers', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get customer by ID
  getCustomer: async (id: number): Promise<Customer> => {
    try {
      const response = await apiClient.get(`/customers/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get customer statistics
  getCustomerStats: async (): Promise<{
    total: number
    new_this_week: number
    satisfaction_avg: number
  }> => {
    try {
      const response = await apiClient.get('/customers/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch customer stats:', error)
      return { total: 0, new_this_week: 0, satisfaction_avg: 0 }
    }
  },
}

// ==========================================
// EMAIL LOGS API
// ==========================================

export const emailsApi = {
  // Get email logs
  getEmailLogs: async (params?: {
    page?: number
    limit?: number
    direction?: string
  }): Promise<EmailLog[]> => {
    try {
      const response = await apiClient.get('/emails/logs', { params })
      // Backend returns { logs: [...], pagination: {...} }
      return response.data.logs || []
    } catch (error) {
      console.error('Failed to fetch email logs:', error)
      return []
    }
  },

  // Get email processing stats
  getEmailStats: async (): Promise<{
    total_processed: number
    today_processed: number
    ai_success_rate: number
    avg_processing_time: number
  }> => {
    try {
      const response = await apiClient.get('/emails/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch email stats:', error)
      return { 
        total_processed: 0, 
        today_processed: 0, 
        ai_success_rate: 0, 
        avg_processing_time: 0 
      }
    }
  },
}

// ==========================================
// AI ASSISTANT API
// ==========================================

export const aiApi = {
  // Test AI query
  testQuery: async (query: string): Promise<{
    response: string
    canSolve: boolean
    department: string
    needsTicket: boolean
  }> => {
    try {
      const response = await apiClient.post('/query', { query })
      return response.data.response
    } catch (error) {
      throw error
    }
  },

  // Get AI insights
  getInsights: async (): Promise<Array<{
    type: string
    title: string
    message: string
    action: string
  }>> => {
    try {
      // This would be a real endpoint in production
      // For now, return static insights
      return [
        {
          type: 'success',
          title: 'High AI Performance',
          message: 'AI successfully resolved 87% of tickets this week',
          action: 'View details'
        },
        {
          type: 'improvement',
          title: 'Knowledge Gap Found',
          message: 'Consider adding solutions for "shipping delays" queries',
          action: 'Add knowledge'
        }
      ]
    } catch (error) {
      console.error('Failed to fetch AI insights:', error)
      return []
    }
  },
}

// ==========================================
// KNOWLEDGE BASE API
// ==========================================

export const knowledgeApi = {
  // Get knowledge base items
  getKnowledge: async (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    try {
      const response = await apiClient.get('/knowledge', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Add knowledge item
  addKnowledge: async (data: {
    category: string
    title: string
    question: string
    solution: string
    keywords: string[]
  }) => {
    try {
      const response = await apiClient.post('/knowledge', data)
      toast.success('Knowledge item added successfully!')
      return response.data
    } catch (error) {
      throw error
    }
  },
}

// ==========================================
// SYSTEM STATUS API
// ==========================================

export const systemApi = {
  // Get system health
  getHealth: async (): Promise<{
    status: 'healthy' | 'degraded' | 'down'
    services: Array<{
      name: string
      status: 'operational' | 'degraded' | 'down'
      uptime: string
    }>
  }> => {
    try {
      const response = await apiClient.get('/health')
      return response.data
    } catch (error) {
      // Return fallback status if health check fails
      return {
        status: 'down',
        services: [
          { name: 'API', status: 'down', uptime: '0%' },
          { name: 'Database', status: 'down', uptime: '0%' },
          { name: 'Email Processing', status: 'down', uptime: '0%' },
          { name: 'AI Assistant', status: 'down', uptime: '0%' },
        ]
      }
    }
  },
}

// Export default client for custom requests
export default apiClient 