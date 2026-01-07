"use client"
import type { User } from "@/lib/types/roles"
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Zap,
    Sparkles,
    Users,
    Shield,
    Activity,
    Server,
    ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { getPrincipalStats } from "@/lib/api-dashboard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"


export default function IctAdminDashboard({ user }: { user?: User }) {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [logs, setLogs] = useState<any[]>([])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPrincipalStats()
                setStats(data)

                // Fetch System Logs
                // Use standardized API client
                const logsRes = await api.get('/system/logs');
                setLogs(logsRes.data)
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 18) return "Good afternoon"
        return "Good evening"
    }

    const data = stats || {
        enrollment: { total: 0, trend: '+0' },
        attendance: { rate: 0, absent_count: 0 },
        finance: { collected: 0, expected: 100, rate: 0 },
        performance: { mean_score: 0, trend: '0.0' },
        risks: { high_risk_count: 0, attendance_alert_message: "No risks detected." },
        insights: [],
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{getGreeting()}, {user?.full_name || 'ICT Admin'}</h1>
                <p className="text-gray-400 mt-1">
                    System Status & Health for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Critical alerts (System Health) */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="glass-card border-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-50" />
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-500">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base text-white">System Status</CardTitle>
                            </div>
                            <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
                                Operational
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <div key={log.id} className="text-xs border-l-2 border-green-500/50 pl-2 py-1 bg-white/5 rounded-r">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-green-400 font-medium">{log.causer}</span>
                                            <span className="text-gray-500 text-[10px]">{log.created_at}</span>
                                        </div>
                                        <p className="text-gray-300">{log.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 mb-3">
                                    All systems are running smoothly. Database response time is normal.
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white w-full justify-center" asChild>
                                <Link href="/settings/logs">
                                    View All Logs
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base text-white">Security Overview</CardTitle>
                            </div>
                            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">
                                Secure
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-sm text-gray-400 mb-3">
                            No recent security incidents reported. 2FA usage is up by 15% among staff.
                        </p>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white" asChild>
                            <Link href="/users">
                                Manage Users
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Key metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <Users className="h-4 w-4" />
                            Total Users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">{data.enrollment.total}</div>
                            {/* Enrollment used as proxy for total users count for now */}
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                <span>+5</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">active accounts</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <Server className="h-4 w-4" />
                            Server Load
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">24%</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingDown className="h-3 w-3" />
                                <span>Stable</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">CPU usage normal</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <AlertTriangle className="h-4 w-4" />
                            Error Logs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">3</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingDown className="h-3 w-3" />
                                <span>-2</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">in last 24 hours</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <Activity className="h-4 w-4" />
                            Uptime
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                <span>Excellent</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Last downtime: 45d ago</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights & Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-white">System Insights</CardTitle>
                        <CardDescription className="text-gray-400">Automated performance analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 bg-purple-500/20 text-purple-500`}>
                                <Zap className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">Traffic Spike Detected</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Unusual traffic detected during exam hours, but system handled it well.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick actions */}
                <Card className="glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-white">Admin Tools</CardTitle>
                        <CardDescription className="text-gray-400">Quick access to management functions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl" asChild>
                                <Link href="/users">Manage Roles & Permissions</Link>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl" asChild>
                                <Link href="/settings">System Configuration</Link>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl" asChild>
                                <Link href="/settings/audit">View Audit Logs</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
