"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import AcademicOverview from "@/components/academic/academic-overview"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function AcademicPage() {
  const { user, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AppShell user={user || undefined}>
      <AcademicOverview />
    </AppShell>
  )
}
