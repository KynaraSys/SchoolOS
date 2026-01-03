"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Mail, MessageSquare, Bell } from "lucide-react"

interface Log {
    id: number
    type: 'sms' | 'email' | 'system'
    subject?: string
    message: string
    sent_at: string
    status: string
    student?: {
        user: {
            name: string
        }
    }
}

interface CommunicationHistoryTableProps {
    logs: Log[]
}

export default function CommunicationHistoryTable({ logs }: CommunicationHistoryTableProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'sms': return <MessageSquare className="h-4 w-4" />
            case 'email': return <Mail className="h-4 w-4" />
            default: return <Bell className="h-4 w-4" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'sms': return "bg-blue-100 text-blue-700"
            case 'email': return "bg-purple-100 text-purple-700"
            default: return "bg-gray-100 text-gray-700"
        }
    }

    if (logs.length === 0) {
        return (
            <div className="text-center p-8 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No communication history found.</p>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="whitespace-nowrap">
                                {format(new Date(log.sent_at), "PPP p")}
                            </TableCell>
                            <TableCell>
                                <div className={`flex items-center gap-2 px-2 py-1 rounded-full w-fit text-xs font-medium ${getTypeColor(log.type)}`}>
                                    {getTypeIcon(log.type)}
                                    <span className="capitalize">{log.type}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {log.student?.user?.name || "General"}
                            </TableCell>
                            <TableCell>
                                <div className="max-w-[400px]">
                                    {log.subject && <p className="font-semibold text-sm">{log.subject}</p>}
                                    <p className="text-sm text-muted-foreground truncate" title={log.message}>
                                        {log.message}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={log.status === 'sent' ? "text-green-600 border-green-200 bg-green-50" : ""}>
                                    {log.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
