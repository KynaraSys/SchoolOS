"use client"

import React, { useState } from "react"
import { MoreVertical, Play, Edit, Trash, Archive, EyeOff, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { retentionApi, RetentionJob } from "@/lib/api-retention"
import { DryRunPanel } from "./dry-run-panel"

export function CleanupJobsTable() {
    const [jobs, setJobs] = useState<RetentionJob[]>([])
    const [loading, setLoading] = useState(true)
    const [dryRunJob, setDryRunJob] = useState<{ name: string, action: string, id: number } | null>(null)

    React.useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        try {
            const data = await retentionApi.getJobs()
            setJobs(data)
        } catch (error) {
            console.error("Failed to load jobs", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return
        try {
            await retentionApi.deleteJob(id)
            loadJobs()
        } catch (e) {
            console.error(e)
        }
    }

    const getActionIcon = (action: string) => {
        switch (action) {
            case "Archive": return <Archive className="w-3.5 h-3.5 text-blue-500" />
            case "Anonymize": return <EyeOff className="w-3.5 h-3.5 text-amber-500" />
            case "Delete": return <Trash className="w-3.5 h-3.5 text-red-500" />
            default: return <FileText className="w-3.5 h-3.5" />
        }
    }

    const getRunStatusIcon = (status: string | null) => {
        if (status === "Success") return <CheckCircle2 className="w-4 h-4 text-green-500" />
        if (status === "Failed") return <XCircle className="w-4 h-4 text-red-500" />
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }

    if (loading) return <div className="p-4 text-center text-muted-foreground">Loading jobs...</div>

    return (
        <div className="rounded-md border border-white/10">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="w-[250px]">Job Name</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.map((job) => (
                        <TableRow key={job.id} className="border-white/10 hover:bg-muted/5">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span>{job.name}</span>
                                    <span className="text-xs text-muted-foreground font-mono">ID: {job.id}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-normal text-xs bg-muted/50">
                                    {job.target}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm">
                                    {getActionIcon(job.action)}
                                    <span>{job.action}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="w-3.5 h-3.5" />
                                    {job.schedule}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        job.status === "Active"
                                            ? "border-green-500/20 text-green-500"
                                            : "border-muted text-muted-foreground"
                                    }
                                >
                                    {job.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {getRunStatusIcon(job.last_run_status)}
                                    <div className="flex flex-col text-xs">
                                        <span>{job.last_run_at ? new Date(job.last_run_at).toLocaleDateString() : '-'}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="glass-card border-white/10 text-white w-48">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem
                                            className="cursor-pointer gap-2"
                                            onClick={() => setDryRunJob({ name: job.name, action: job.action, id: job.id })}
                                        >
                                            <Play className="w-4 h-4 text-green-400" /> Run Now (Dry Run)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer gap-2">
                                            <Edit className="w-4 h-4" /> Edit Job
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/10" />
                                        <DropdownMenuItem
                                            className="cursor-pointer gap-2 text-red-400 focus:text-red-400"
                                            onClick={() => handleDelete(job.id)}
                                        >
                                            <Trash className="w-4 h-4" /> Delete Job
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {dryRunJob && (
                <DryRunPanel
                    open={!!dryRunJob}
                    onClose={() => setDryRunJob(null)}
                    jobName={dryRunJob.name}
                    actionType={dryRunJob.action}
                />
            )}
        </div>
    )
}
