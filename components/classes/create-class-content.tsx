"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { ClassForm } from "@/components/classes/class-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

export function CreateClassContent() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <Link href="/classes">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Classes
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">Create New Class</h1>
                <p className="text-muted-foreground mt-1">Add a new class to the academic structure</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                    <ClassForm />
                </Suspense>
            </div>
        </div>
    )
}
