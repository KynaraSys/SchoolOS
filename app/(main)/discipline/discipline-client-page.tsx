"use client"

import { useAuth } from "@/components/auth/auth-provider"
import DisciplineOverview from "@/components/discipline/discipline-overview"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"

export default function DisciplineClientPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <DisciplineOverview user={user || null} />
    )
}
