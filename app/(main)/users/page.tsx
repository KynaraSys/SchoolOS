"use client"

import { useAuth } from "@/components/auth/auth-provider"
import UsersList from "@/components/users/users-list"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function UsersPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Authorization check
    // Ideally this should be wrapped in a Higher Order Component or middleware
    // but for now we do a simple check.
    useEffect(() => {
        if (!isLoading && user && user.role !== 'owner' && user.role !== 'admin' && user.role !== 'ict_admin') {
            router.push('/dashboard')
        }
    }, [user, isLoading, router])

    if (!isMounted || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold">User Management</h1>
                <p className="text-muted-foreground mt-1">Manage system access, roles, and staff assignments</p>
            </div>
            <UsersList />
        </div>
    )
}
