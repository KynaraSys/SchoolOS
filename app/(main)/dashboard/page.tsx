"use client"

import { useAuth } from "@/components/auth/auth-provider"
import OverviewDashboard from "@/components/overview-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <OverviewDashboard user={user || undefined} />
  )
}
