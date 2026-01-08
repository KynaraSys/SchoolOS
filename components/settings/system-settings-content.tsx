"use client"

import { useAuth } from "@/components/auth/auth-provider"
import SystemSettings from "@/components/settings/system-settings"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export function SystemSettingsContent() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <SystemSettings />
    )
}
