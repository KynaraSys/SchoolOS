"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import { Loader2, Bus, MapPin, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

export default function TransportPage() {
    const { user, isLoading } = useAuth()
    const [isMounted, setIsMounted] = useState(false)

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

    return (
        <AppShell user={user || undefined}>
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#1a1f36]">Transport & Boarding</h1>
                    <p className="text-muted-foreground mt-2">
                        View transport routes, schedules, and boarding details.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Transport Card */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                    <Bus className="h-5 w-5" />
                                </div>
                                <CardTitle>Transport Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900">Assigned Route</h4>
                                <div className="flex items-center gap-2 mt-2 text-gray-700">
                                    <MapPin className="h-4 w-4 text-indigo-500" />
                                    <span>Route 4: Westlands - Waiyaki Way</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">Schedule</h4>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="text-xs text-muted-foreground uppercase">Morning Pick-up</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4 text-emerald-500" />
                                            <span className="font-medium">6:45 AM</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <span className="text-xs text-muted-foreground uppercase">Evening Drop-off</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="h-4 w-4 text-emerald-500" />
                                            <span className="font-medium">4:30 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Transport Notices</h4>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <div className="flex gap-2">
                                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-900">Construction Delay</p>
                                            <p className="text-xs text-amber-700 mt-1">
                                                Expect a 15-minute delay on Waiyaki Way drop-offs this week due to road works.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Boarding Card (If applicable) */}
                    <Card className="border-0 shadow-md">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <CardTitle>Boarding Status</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <MapPin className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Day Scholar</h3>
                                <p className="text-muted-foreground mt-1 max-w-xs mx-auto">
                                    Sarah Wanjiru is currently registered as a Day Scholar and does not have boarding details.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppShell>
    )
}
