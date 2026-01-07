"use client"

import { useAuth } from "@/components/auth/auth-provider"
import MyClassDashboard from "@/components/my-class/class-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export default function MyClassPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <MyClassDashboard />
    )
}
