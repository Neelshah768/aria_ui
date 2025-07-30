// 🌐 API CLIENT
// Central API communication layer for backend integration

import axios from 'axios'
import toast from 'react-hot-toast'
import { ApiResponse, Ticket, Customer, EmailLog, DashboardStats, AnalyticsData, Document, DocumentUploadResponse, DocumentSearchResponse, DocumentAnalytics, ProcessingJob } from './types'

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
// DOCUMENT MANAGEMENT API
// ==========================================

export const documentsApi = {
  // Upload single document
  uploadDocument: async (
    file: File, 
    metadata?: {
      title?: string
      description?: string
      tags?: string
      clientId?: string
      author?: string
    }
  ): Promise<DocumentUploadResponse> => {
    try {
      const formData = new FormData()
      formData.append('document', file)
      
      if (metadata?.title) formData.append('title', metadata.title)
      if (metadata?.description) formData.append('description', metadata.description)
      if (metadata?.tags) formData.append('tags', metadata.tags)
      if (metadata?.clientId) formData.append('clientId', metadata.clientId)
      if (metadata?.author) formData.append('author', metadata.author)

      const response = await apiClient.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      toast.success(`Document "${file.name}" uploaded successfully!`)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed'
      toast.error(`Upload failed: ${message}`)
      throw error
    }
  },

  // Upload multiple documents
  uploadDocuments: async (
    files: File[], 
    metadata?: {
      clientId?: string
      author?: string
    }
  ): Promise<{
    processed: number
    failed: number
    results: DocumentUploadResponse[]
    errors: Array<{ filename: string; error: string }>
  }> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('documents', file))
      
      if (metadata?.clientId) formData.append('clientId', metadata.clientId)
      if (metadata?.author) formData.append('author', metadata.author)

      const response = await apiClient.post('/documents/upload/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const { processed, failed } = response.data.data
      toast.success(`Uploaded ${processed} documents successfully${failed > 0 ? `, ${failed} failed` : ''}`)
      return response.data.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Bulk upload failed'
      toast.error(`Bulk upload failed: ${message}`)
      throw error
    }
  },

  // Get all documents with filtering and pagination
  getDocuments: async (params?: {
    page?: number
    limit?: number
    status?: string
    fileType?: string
    clientId?: string
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    documents: Document[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> => {
    try {
      const response = await apiClient.get('/documents', { params })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      throw error
    }
  },

  // Get document by ID
  getDocument: async (id: string, includeChunks: boolean = false): Promise<{
    document: Document
    chunks?: any[]
    totalChunks?: number
  }> => {
    try {
      const response = await apiClient.get(`/documents/${id}`, {
        params: { includeChunks }
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  // Update document metadata
  updateDocument: async (id: string, updates: {
    title?: string
    description?: string
    tags?: string[]
    author?: string
  }): Promise<Document> => {
    try {
      const response = await apiClient.put(`/documents/${id}`, updates)
      toast.success('Document updated successfully!')
      return response.data.data.document
    } catch (error) {
      throw error
    }
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/documents/${id}`)
      toast.success('Document deleted successfully!')
    } catch (error) {
      throw error
    }
  },

  // Get processing status
  getProcessingStatus: async (id: string): Promise<{
    document: {
      id: string
      filename: string
      status: string
      progress: number
      error?: string
      uploadedAt: string
      processedAt?: string
      lastUpdated: string
    }
    jobs: ProcessingJob[]
  }> => {
    try {
      const response = await apiClient.get(`/documents/${id}/status`)
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  // Retry failed processing
  retryProcessing: async (id: string): Promise<void> => {
    try {
      await apiClient.post(`/documents/${id}/retry`)
      toast.success('Processing retry queued successfully!')
    } catch (error) {
      throw error
    }
  },

  // Search documents and knowledge base
  searchDocuments: async (query: string, options?: {
    limit?: number
    threshold?: number
    searchType?: 'vector' | 'keyword' | 'hybrid'
    clientId?: string
  }): Promise<DocumentSearchResponse> => {
    try {
      const response = await apiClient.post('/documents/search', {
        query,
        ...options
      })
      return response.data.data
    } catch (error) {
      throw error
    }
  },

  // Get document analytics
  getDocumentAnalytics: async (params?: {
    clientId?: string
    days?: number
  }): Promise<DocumentAnalytics> => {
    try {
      const response = await apiClient.get('/documents/analytics/stats', { params })
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch document analytics:', error)
      // Return fallback data
      return {
        total_documents: 0,
        completed_documents: 0,
        processing_documents: 0,
        failed_documents: 0,
        pending_documents: 0,
        total_file_size: 0,
        total_words: 0,
        avg_words_per_doc: 0,
        fileTypes: [],
        uploadTrends: []
      }
    }
  }
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