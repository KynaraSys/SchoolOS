"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import api from "@/lib/api"
import { useAuth } from "@/components/auth/auth-provider"

export default function RouteChangeTracker() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const lastPathRef = useRef<string | null>(null)

    useEffect(() => {
        if (!user) return

        // Construct full URL path including query params (optional, but helpful)
        const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

        // Prevent duplicate logging if strict mode fires twice or quick re-renders (though useEffect dependency handles this mostly)
        // Actually, just logging on pathname change is safer.
        // Also don't log if it matches the last logged path immediately (debounce/dedupe simple)
        if (lastPathRef.current === currentPath) return

        lastPathRef.current = currentPath

        const logVisit = async () => {
            try {
                // Determine a readable title
                let title = "Unknown Page"
                if (pathname === '/dashboard') title = "Dashboard"
                else if (pathname === '/auth/login') return // Don't log login page specifically or handled by auth logging
                else if (pathname.startsWith('/students')) title = "Student Module"
                else if (pathname.startsWith('/guardians')) title = "Guardian Module"
                else if (pathname.startsWith('/settings/logs')) title = "System Logs"
                else if (pathname.startsWith('/finance')) title = "Finance Module"
                else if (pathname.startsWith('/academics')) title = "Academics Module"
                else {
                    // Fallback: capitalize first segment
                    const segment = pathname.split('/')[1]
                    title = segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Home"
                }

                await api.post('/system/log-visit', {
                    page: title,
                    url: currentPath
                })
            } catch (error) {
                // Silently fail to avoid disrupting user experience
                console.error("Failed to log visit", error)
            }
        }

        // Small delay to ensure route transition completed? Not strictly necessary with Next.js router events but good practice.
        // Actually, immediate is fine.
        logVisit()

    }, [pathname, searchParams, user])

    return null // Renderless component
}
