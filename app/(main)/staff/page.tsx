"use client"

import { useAuth } from "@/components/auth/auth-provider"
import StaffOverview from "@/components/staff/staff-overview"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function StaffPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <StaffOverview />
  )
}
