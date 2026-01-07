"use client"

import { useAuth } from "@/components/auth/auth-provider"
import WorkflowOverview from "@/components/workflows/workflow-overview"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function WorkflowsPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <WorkflowOverview />
  )
}
