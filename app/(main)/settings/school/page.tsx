import { useAuth } from "@/components/auth/auth-provider"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"
import dynamicImport from "next/dynamic"

// Dynamically import SchoolSettings with SSR disabled to prevent build errors
const SchoolSettings = dynamicImport(() => import("@/components/settings/school-settings"), {
  ssr: false,
  loading: () => <DashboardSkeleton />,
})

export default function SchoolSettingsPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return <DashboardSkeleton />
  }

  return <SchoolSettings />
}
