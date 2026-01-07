"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { UserForm } from "@/components/users/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateUserPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <Link href="/users">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Users
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">Create New User</h1>
                <p className="text-muted-foreground mt-1">Add a new staff member, student, or parent to the system</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <UserForm />
            </div>
        </div>
    )
}
