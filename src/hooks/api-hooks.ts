// 🎣 API HOOKS
// Custom React hooks for data fetching with React Query

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  dashboardApi, 
  ticketsApi, 
  customersApi, 
  emailsApi, 
  aiApi, 
  knowledgeApi, 
  systemApi 
} from '@/lib/api'

// ==========================================
// DASHBOARD HOOKS
// ==========================================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 20000, // Data is fresh for 20 seconds
  })
}

export const useDashboardAnalytics = (days: number = 7) => {
  return useQuery({
    queryKey: ['dashboard', 'analytics', days],
    queryFn: () => dashboardApi.getAnalytics(days),
    refetchInterval: 60000, // Refetch every minute
  })
}

// ==========================================
// TICKETS HOOKS
// ==========================================

export const useTickets = (params?: {
  page?: number
  limit?: number
  status?: string
  priority?: string
  search?: string
}) => {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketsApi.getTickets(params),
    staleTime: 30000,
  })
}

export const useTicket = (id: number) => {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketsApi.getTicket(id),
    enabled: !!id,
  })
}

export const useRecentTickets = (limit: number = 5) => {
  return useQuery({
    queryKey: ['tickets', 'recent', limit],
    queryFn: () => ticketsApi.getRecentTickets(limit),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  })
}

export const useCreateTicket = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ticketsApi.createTicket,
    onSuccess: () => {
      // Invalidate and refetch tickets data
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ticketsApi.updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// ==========================================
// CUSTOMERS HOOKS
// ==========================================

export const useCustomers = (params?: {
  page?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.getCustomers(params),
    staleTime: 60000, // Customer data changes less frequently
  })
}

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getCustomer(id),
    enabled: !!id,
  })
}

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ['customers', 'stats'],
    queryFn: customersApi.getCustomerStats,
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

// ==========================================
// EMAIL LOGS HOOKS
// ==========================================

export const useEmailLogs = (params?: {
  page?: number
  limit?: number
  direction?: string
}) => {
  return useQuery({
    queryKey: ['emails', params],
    queryFn: () => emailsApi.getEmailLogs(params),
    staleTime: 60000,
  })
}

export const useEmailStats = () => {
  return useQuery({
    queryKey: ['emails', 'stats'],
    queryFn: emailsApi.getEmailStats,
    refetchInterval: 30000, // Real-time email processing stats
  })
}

// ==========================================
// AI ASSISTANT HOOKS
// ==========================================

export const useAIQuery = () => {
  return useMutation({
    mutationFn: aiApi.testQuery,
  })
}

export const useAIInsights = () => {
  return useQuery({
    queryKey: ['ai', 'insights'],
    queryFn: aiApi.getInsights,
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 240000, // Insights are stable for 4 minutes
  })
}

// ==========================================
// KNOWLEDGE BASE HOOKS
// ==========================================

export const useKnowledge = (params?: {
  category?: string
  search?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['knowledge', params],
    queryFn: () => knowledgeApi.getKnowledge(params),
    staleTime: 300000, // Knowledge base changes infrequently
  })
}

export const useAddKnowledge = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: knowledgeApi.addKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] })
      queryClient.invalidateQueries({ queryKey: ['ai', 'insights'] })
    },
  })
}

// ==========================================
// SYSTEM STATUS HOOKS
// ==========================================

export const useSystemHealth = () => {
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: systemApi.getHealth,
    refetchInterval: 30000, // Check system health every 30 seconds
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// ==========================================
// REAL-TIME DATA HOOKS
// ==========================================

// Hook for real-time dashboard updates
export const useRealTimeDashboard = () => {
  const queryClient = useQueryClient()

  // Force refresh all dashboard data
  const refreshDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['tickets', 'recent'] })
    queryClient.invalidateQueries({ queryKey: ['emails', 'stats'] })
    queryClient.invalidateQueries({ queryKey: ['system', 'health'] })
  }

  return {
    refreshDashboard,
  }
}

// Hook for auto-refresh functionality
export const useAutoRefresh = (interval: number = 30000) => {
  const { refreshDashboard } = useRealTimeDashboard()

  // Set up interval for auto-refresh
  if (typeof window !== 'undefined') {
    setInterval(refreshDashboard, interval)
  }

  return {
    refreshDashboard,
  }
}

// ==========================================
// ERROR HANDLING HOOK
// ==========================================

export const useApiError = () => {
  const handleError = (error: any, defaultMessage: string = 'An error occurred') => {
    console.error('API Error:', error)
    
    if (error?.response?.data?.message) {
      return error.response.data.message
    }
    
    if (error?.message) {
      return error.message
    }
    
    return defaultMessage
  }

  return { handleError }
}

// ==========================================
// LOADING STATE HOOK
// ==========================================

export const useLoadingState = () => {
  const dashboardLoading = useDashboardStats().isLoading
  const ticketsLoading = useRecentTickets().isLoading
  const emailStatsLoading = useEmailStats().isLoading

  const isAnyLoading = dashboardLoading || ticketsLoading || emailStatsLoading

  return {
    dashboardLoading,
    ticketsLoading,
    emailStatsLoading,
    isAnyLoading,
  }
} 