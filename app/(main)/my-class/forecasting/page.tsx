"use client"

import { useAuth } from "@/components/auth/auth-provider"
import ForecastingView from "@/components/my-class/forecasting-view"
import { Loader2 } from "lucide-react"
import { Suspense } from "react"

export default function ForecastingPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <ForecastingView />
        </Suspense>
    )
}
