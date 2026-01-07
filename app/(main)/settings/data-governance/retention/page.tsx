"use client"

import React from "react"
import { ShieldAlert, Clock, Archive, Trash2, AlertTriangle, CheckCircle2, History, FileText, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CleanupJobsTable } from "@/components/retention/cleanup-jobs-table"
import { JobEditorModal } from "@/components/retention/job-editor-modal"
import { ActivityLog } from "@/components/retention/activity-log"

export default function DataRetentionPage() {
    return (
        <div className="space-y-6 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Data Retention & Cleanup
                        </h1>
                        <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 gap-1.5">
                            <ShieldAlert className="w-3 h-3" />
                            Governance
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage automated data retention policies, archiving, and deletion of sensitive records.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Environment Status Badge */}
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            Last Run: <span className="text-foreground">Today, 02:00 AM</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            Next Run: <span className="text-foreground">Tomorrow, 02:00 AM</span>
                        </div>
                    </div>

                    <Button variant="outline" className="gap-2">
                        <History className="w-4 h-4" />
                        View Audit Logs
                    </Button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-500 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-semibold">Destructive Actions Enabled</p>
                    <p className="opacity-90">
                        Retention policies affect real user data. Deleted records cannot be restored.
                        Always run a <strong>Dry Run</strong> before scheduling new cleanup jobs.
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Students"
                    icon={Archive}
                    stats={[
                        { label: "Active", value: "1,240" },
                        { label: "Archived", value: "450" },
                        { label: "Anonymized", value: "120" }
                    ]}
                    color="blue"
                />
                <SummaryCard
                    title="Guardians"
                    icon={Archive}
                    stats={[
                        { label: "Active", value: "850" },
                        { label: "Pending Cleanup", value: "45", highlight: true }
                    ]}
                    color="indigo"
                />
                <SummaryCard
                    title="System Logs"
                    icon={Trash2}
                    stats={[
                        { label: "Total Size", value: "2.4 GB" },
                        { label: "Retention", value: "90 Days" }
                    ]}
                    color="slate"
                />
                <SummaryCard
                    title="Financial Records"
                    icon={ShieldAlert}
                    stats={[
                        { label: "Status", value: "Locked" },
                        { label: "Min Retention", value: "7 Years" }
                    ]}
                    color="emerald"
                />
            </div>

            {/* Main Content Area - Placeholder */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Cleanup Jobs</CardTitle>
                            <CardDescription>Scheduled automation for data lifecycle management</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CleanupJobsTable />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <JobEditorModal />
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 gap-2 border-white/10 hover:bg-white/5">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    Export Report
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2 border-white/10 hover:bg-white/5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                    Audit Trail
                                </Button>
                            </div>
                            <Button className="w-full gap-2" variant="outline">
                                <Clock className="w-4 h-4" />
                                View Schedule
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity Log Section - Full Width */}
                <div className="md:col-span-3">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5 text-muted-foreground" />
                                Recent Activity Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityLog />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function SummaryCard({ title, icon: Icon, stats, color }: {
    title: string,
    icon: any,
    stats: { label: string, value: string, highlight?: boolean }[],
    color: string
}) {
    const colorClasses = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        slate: "text-slate-500 bg-slate-500/10 border-slate-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    }

    return (
        <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {/* @ts-ignore */}
                <div className={cn("p-2 rounded-lg", colorClasses[color])}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mt-2">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{stat.label}</span>
                            <span className={cn(
                                "font-mono font-medium",
                                stat.highlight ? "text-amber-500" : "text-foreground"
                            )}>
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
