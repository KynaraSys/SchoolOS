"use client"
import type { User } from "@/lib/types/roles"
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Zap,
    Sparkles,
    Users,
    DollarSign,
    Calendar,
    BookOpen,
    ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { getPrincipalStats } from "@/lib/api-dashboard"

export default function OwnerDashboard({ user }: { user?: User }) {
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

    // Formatting helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount)
    }

    const data = stats || {
        enrollment: { total: 0, trend: '+0' },
        attendance: { rate: 0, absent_count: 0 },
        finance: { collected: 0, expected: 100, rate: 0 },
        performance: { mean_score: 0, trend: '0.0' },
        risks: { high_risk_count: 0, attendance_alert_message: "No risks detected." },
        insights: [],
        fee_defaulters: []
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">{getGreeting()}, {user?.full_name || 'Owner'}</h1>
                <p className="text-gray-400 mt-1">
                    High-level overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
                    <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-red-500/20 text-red-500">
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base text-white">Fee Collection</CardTitle>
                            </div>
                            <Badge variant="outline" className={`border-${data.finance.rate < 50 ? 'red' : 'green'}-500 text-${data.finance.rate < 50 ? 'red' : 'green'}-400 bg-${data.finance.rate < 50 ? 'red' : 'green'}-500/10`}>
                                {data.finance.rate}% Collected
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-sm text-gray-400 mb-3">
                            {formatCurrency(data.finance.expected - data.finance.collected)} outstanding. {formatCurrency(data.finance.collected)} collected this term.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white"
                            onClick={() => document.getElementById('fee-recommendations')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            View Recommendations
                            <ArrowUpRight className="h-4 w-4" />
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
                            <DollarSign className="h-4 w-4" />
                            Term Fee Collection
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-bold text-white">{data.finance.rate}%</div>
                            <div className="flex items-center gap-1 text-sm text-green-400">
                                <TrendingUp className="h-3 w-3" />
                                <span>Target: 85%</span>
                            </div>
                        </div>
                        <Progress value={data.finance.rate} className="mt-2 h-1.5 bg-white/10" />
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
                    <CardTitle className="text-white">AI Insights: What Changed This Week</CardTitle>
                    <CardDescription className="text-gray-400">Automated analysis of your school's data</CardDescription>
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
                    <CardDescription className="text-gray-400">Natural language queries about your school</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Which students are at risk this term?</span>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Why is Form 3 underperforming?</span>
                        </Button>
                        <Button variant="outline" className="justify-start h-auto p-3 text-left bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all rounded-xl">
                            <span className="text-sm">Show fee defaulters by class</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Fee Collection Recommendations */}
            <Card id="fee-recommendations" className="glass-card border-none relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-30" />
                <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white">Fee Collection Recommendations</CardTitle>
                            <CardDescription className="text-gray-400">Top priority follow-ups for outstanding balances</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-red-500 text-red-400 bg-red-500/10">
                            Action Required
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="space-y-3">
                        {!data.fee_defaulters || data.fee_defaulters.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No overdue accounts found.</div>
                        ) : (
                            data.fee_defaulters.map((defaulter: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">{defaulter.name}</p>
                                        <p className="text-xs text-gray-400">{defaulter.class}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-red-400">{formatCurrency(defaulter.balance)}</p>
                                            <p className="text-xs text-gray-500">Outstanding</p>
                                        </div>
                                        <Badge variant="outline" className="border-white/20 text-gray-300">
                                            {defaulter.recommendation}
                                        </Badge>
                                        <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white" asChild>
                                            <Link href={`/students/${defaulter.id}`}>Profile</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
