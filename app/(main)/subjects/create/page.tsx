"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { SubjectForm } from "@/components/academic/subject-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateSubjectPage() {
    const { user } = useAuth()

    return (
        <div className="space-y-6">
            <div>
                <Link href="/subjects">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Subjects
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mt-2">Add New Subject</h1>
                <p className="text-muted-foreground mt-1">Define a new academic subject</p>
            </div>

            <div className="border rounded-lg p-6 bg-card">
                <SubjectForm />
            </div>
        </div>
    )
}
