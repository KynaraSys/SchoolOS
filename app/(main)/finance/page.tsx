"use client"

import { useAuth } from "@/components/auth/auth-provider"
import FinanceOverview from "@/components/finance/finance-overview"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function FinancePage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <FinanceOverview />
  )
}
