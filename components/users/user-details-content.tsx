"use client"

import { useAuth } from "@/components/auth/auth-provider"
import UserDetails from "@/components/users/user-details"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export function UserDetailsContent() {
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
        <UserDetails userId={id} />
    )
}
