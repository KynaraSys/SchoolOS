"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login')
        }
    }, [isLoading, user, router])

    if (!isMounted || isLoading) {
        return <DashboardSkeleton />
    }

    // Gentle fallback or skeleton if user is not yet ready but loading finished (should redirect though)
    if (!user) return <DashboardSkeleton />

    return (
        <AppShell user={user}>
            {children}
        </AppShell>
    )
}
