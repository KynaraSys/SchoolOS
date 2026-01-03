"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import SystemSettings from "@/components/settings/system-settings"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function SystemSettingsPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <AppShell user={user || undefined}>
      <SystemSettings />
    </AppShell>
  )
}
