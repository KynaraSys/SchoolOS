"use client"

import { useAuth } from "@/components/auth/auth-provider"
import ClassDetails from "@/components/classes/class-details"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function ClassDetailsPage() {
    const { user, isLoading: authLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const params = useParams()
    const [className, setClassName] = useState<string>("")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleClassLoaded = (name: string) => {
        setClassName(name)
    }

    if (!isMounted || authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const id = params?.id as string

    return (
        <ClassDetails classId={id} onClassLoaded={handleClassLoaded} />
    )
}
