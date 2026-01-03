"use client"

import { useAuth } from "@/components/auth/auth-provider"
import AppShell from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Filter } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import CommunicationHistoryTable from "@/components/guardians/communication-history-table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function CommunicationHistoryPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [guardianName, setGuardianName] = useState("")
    const [students, setStudents] = useState<any[]>([])

    // Filters
    const [studentFilter, setStudentFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams()
            if (studentFilter && studentFilter !== 'all') queryParams.append('student_id', studentFilter)
            if (typeFilter && typeFilter !== 'all') queryParams.append('type', typeFilter)
            if (dateFrom) queryParams.append('date_from', dateFrom)
            if (dateTo) queryParams.append('date_to', dateTo)

            const response = await api.get(`/guardians/${params.id}/communication?${queryParams.toString()}`)
            setLogs(response.data.data)
        } catch (error) {
            console.error("Failed to load logs", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load communication history.",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchGuardianInfo = async () => {
            try {
                const res = await api.get(`/guardians/${params.id}`)
                setGuardianName(`${res.data.first_name} ${res.data.last_name}`)
                setStudents(res.data.students || [])
            } catch (e) { console.error(e) }
        }

        if (params.id) {
            fetchGuardianInfo()
            fetchLogs()
        }
    }, [params.id])

    // Re-fetch when filters change
    useEffect(() => {
        if (!loading) { // Avoid initial double fetch, but simple logic for now
            fetchLogs()
        }
    }, [studentFilter, typeFilter, dateFrom, dateTo])

    if (authLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <AppShell user={user || undefined}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Communication History</h1>
                            <p className="text-muted-foreground">
                                For {guardianName}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card">
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Filter by Student</label>
                            <Select value={studentFilter} onValueChange={setStudentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Students" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Students</SelectItem>
                                    {students.map((s: any) => (
                                        <SelectItem key={s.student.id} value={s.student.id.toString()}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Filter by Type</label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="sms">SMS</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Date From</label>
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 min-w-[150px]">
                            <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Date To</label>
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>

                        {/* Clear Filters Button could go here */}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <CommunicationHistoryTable logs={logs} />
                )}
            </div>
        </AppShell>
    )
}
