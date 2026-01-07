"use client"

import { useAuth } from "@/components/auth/auth-provider"
import ResultsEntry from "@/components/exams/results-entry"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ResultsEntryPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const params = useParams()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const id = params?.id as string

    return (
        <ResultsEntry examId={id} />
    )
}
