"use client"

import { useAuth } from "@/components/auth/auth-provider"
import StaffList from "@/components/staff/staff-list"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import AddStaffDialog from "@/components/staff/add-staff-dialog"

export default function StaffDirectoryPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/staff">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
                        <p className="text-muted-foreground">Manage all staff members and their roles</p>
                    </div>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Staff Member
                </Button>
            </div>

            <StaffList />

            <AddStaffDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
        </div>
    )
}
