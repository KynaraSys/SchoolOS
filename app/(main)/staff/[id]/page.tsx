"use client"

import { useAuth } from "@/components/auth/auth-provider"
import StaffDetails from "@/components/staff/staff-details"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function StaffDetailsPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const params = useParams()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return <DashboardSkeleton />
    }

    const id = params?.id as string

    return (
        <StaffDetails userId={id} />
    )
}
