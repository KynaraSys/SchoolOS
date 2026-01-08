"use client"

import { useAuth } from "@/components/auth/auth-provider"
import SchoolSettings from "@/components/settings/school-settings"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState, Suspense } from "react"

export const dynamic = "force-dynamic";

export default function SchoolSettingsPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <SchoolSettings />
    </Suspense>
  )
}
