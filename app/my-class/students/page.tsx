"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import StudentsList from "@/components/my-class/students-list"
import { Loader2 } from "lucide-react"

export default function MyClassStudentsPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AppShell user={user || undefined}>
            <StudentsList />
        </AppShell>
    )
}
