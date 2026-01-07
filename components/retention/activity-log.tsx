"use client"

import React from "react"
import { FileText, User, Calendar, ShieldCheck, AlertCircle } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const MOCK_LOGS = [
    {
        id: 1,
        timestamp: "2024-03-04 14:30:22",
        jobName: "Archive Graduated Students",
        action: "Archive",
        recordsAffected: 45,
        initiatedBy: "System (Scheduled)",
        status: "Success",
        dryRun: false
    },
    {
        id: 2,
        timestamp: "2024-03-04 14:00:05",
        jobName: "Delete Guardian Records",
        action: "Delete",
        recordsAffected: 0,
        initiatedBy: "Admin (Manual)",
        status: "Dry Run",
        dryRun: true
    },
    {
        id: 3,
        timestamp: "2024-03-03 02:00:00",
        jobName: "Purge SEN Evidence",
        action: "Delete",
        recordsAffected: 12,
        initiatedBy: "System (Scheduled)",
        status: "Failed",
        dryRun: false
    }
]

export function ActivityLog() {
    return (
        <div className="rounded-md border border-white/10">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Job Name</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Records</TableHead>
                        <TableHead>Iniatiated By</TableHead>
                        <TableHead className="text-right">Result</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_LOGS.map((log) => (
                        <TableRow key={log.id} className="border-white/10 hover:bg-muted/5">
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {log.timestamp}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                                {log.jobName}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-xs font-normal opacity-80">
                                    {log.action}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                                {log.recordsAffected}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {log.initiatedBy}
                            </TableCell>
                            <TableCell className="text-right">
                                {log.status === "Success" && (
                                    <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                                        Success
                                    </Badge>
                                )}
                                {log.status === "Failed" && (
                                    <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                                        Failed
                                    </Badge>
                                )}
                                {log.status === "Dry Run" && (
                                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                                        Dry Run
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
