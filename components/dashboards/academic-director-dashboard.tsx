"use client"
import type { User } from "@/lib/types/roles"
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Zap,
    Sparkles,
    Users,
    Calendar,
    BookOpen,
    ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { getPrincipalStats } from "@/lib/api-dashboard"

export default function AcademicDirectorDashboard({ user }: { user?: User }) {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPrincipalStats()
                setStats(data)
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
        performance: { mean_score: 0, trend: '0.0' },
        risks: { high_risk_count: 0, attendance_alert_message: "No risks detected." },
        insights: [],
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{getGreeting()}, {user?.full_name || 'Academic Director'}</h1>
                <p className="text-gray-400 mt-1">
                    Academic Overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Critical alerts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="glass-card border-none relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-50" />
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-orange-500/20 text-orange-500">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base text-white">Attendance Alert</CardTitle>
                            </div>
                            <Badge variant="outline" className="border-orange-500 text-orange-400 bg-orange-500/10">
                                Action Required
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-sm text-gray-400 mb-3">
                            {data.risks.attendance_alert_message} Early intervention recommended.
                        </p>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white" asChild>
                            <Link href="/attendance">
                                Review Attendance
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-500">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base text-white">Academic Performance</CardTitle>
                            </div>
                            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10">
                                On Track
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-sm text-gray-400 mb-3">
                            Mean score is {data.performance.mean_score}%, trending {parseFloat(data.performance.trend) >= 0 ? 'up' : 'down'} by {Math.abs(parseFloat(data.performance.trend))}%.
                        </p>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white" asChild>
                            <Link href="/academic/reports">
                                View Reports
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Key metrics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <Users className="h-4 w-4" />
                            Total Enrollment
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">{data.enrollment.total}</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                <span>{data.enrollment.trend}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">vs last term</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <Calendar className="h-4 w-4" />
                            Today's Attendance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">{data.attendance.rate}%</div>
                            <div className="flex items-center gap-1 text-sm text-red-400">
                                <TrendingDown className="h-3 w-3" />
                                <span>Daily</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{data.attendance.absent_count} students absent</p>
                    </CardContent>
                </Card>

                <Card className="glass-card border-none">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 text-gray-400">
                            <BookOpen className="h-4 w-4" />
                            Mean Performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">{data.performance.mean_score}%</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                <span>{data.performance.trend}%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">vs. last exam cycle</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Insights */}
            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle className="text-white">AI Insights: Academic Trends</CardTitle>
                    <CardDescription className="text-gray-400">Automated analysis of student performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.insights && data.insights.length > 0 ? (
                        data.insights.map((insight: any, index: number) => {
                            // Dynamic Icon Logic
                            let Icon = TrendingUp;
                            let colorClass = "bg-green-500/20 text-green-500";

                            if (insight.type === 'anomaly') {
                                Icon = AlertTriangle;
                                colorClass = "bg-red-500/20 text-red-500";
                            } else if (insight.type === 'correlation') {
                                Icon = Zap;
                                colorClass = "bg-purple-500/20 text-purple-500";
                            } else if (insight.type === 'prediction') {
                                Icon = Sparkles;
                                colorClass = "bg-indigo-500/20 text-indigo-400";
                            }

                            return (
                                <div key={index} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${colorClass}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{insight.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {insight.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white">Analyzing Data...</p>
                                <p className="text-xs text-gray-400 mt-1">AI insights will appear here once enough data is collected.</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 flex-shrink-0 text-orange-500">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">{data.risks.high_risk_count} Students at High Risk</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Based on performance trajectory and attendance patterns. Early intervention recommended.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quick actions */}
            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle className="text-white">Ask Your Data</CardTitle>
                    <CardDescription className="text-gray-400">Natural language queries about academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Which subjects are underperforming?</span>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Show top students this term</span>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Compare Form 3 vs Form 4 performance</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
