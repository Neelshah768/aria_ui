'use client'

// 🏠 MAIN DASHBOARD PAGE
// Primary dashboard interface with sidebar navigation

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardOverview } from '@/components/dashboard/overview'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  )
}
