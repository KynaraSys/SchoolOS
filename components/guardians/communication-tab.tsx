import { Button } from "@/components/ui/button"
import { Filter, Loader2, Save, MessageSquare, MessageCircle, Mail, Clock } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SendMessageDialog from "@/components/guardians/send-message-dialog"

interface CommunicationTabProps {
    guardian: any
}

export default function CommunicationTab({ guardian }: CommunicationTabProps) {
    const { toast } = useToast()
    const [logs, setLogs] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        sms_count: 0,
        email_count: 0,
        last_contact: null as string | null
    })
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState<any[]>([])
    const [updatingParams, setUpdatingParams] = useState<Record<string, boolean>>({})

    // Filters
    const [studentFilter, setStudentFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")

    // Local state for preferences to avoid reload
    const [preferences, setPreferences] = useState({
        receives_sms: guardian.receives_sms,
        receives_email: guardian.receives_email,
        receives_whatsapp: guardian.receives_whatsapp,
        receives_portal: guardian.receives_portal,
        receives_calls: guardian.receives_calls,
    })

    useEffect(() => {
        if (guardian) {
            setStudents(guardian.students || [])
            // Sync props to state if props update (e.g. from parent refresh)
            setPreferences({
                receives_sms: guardian.receives_sms,
                receives_email: guardian.receives_email,
                receives_whatsapp: guardian.receives_whatsapp,
                receives_portal: guardian.receives_portal,
                receives_calls: guardian.receives_calls,
            })
        }
    }, [guardian])

    const fetchLogs = async () => {
        try {
            setLoading(true)
            const queryParams = new URLSearchParams()
            if (studentFilter && studentFilter !== 'all') queryParams.append('student_id', studentFilter)
            if (typeFilter && typeFilter !== 'all') queryParams.append('type', typeFilter)
            if (dateFrom) queryParams.append('date_from', dateFrom)
            if (dateTo) queryParams.append('date_to', dateTo)

            const response = await api.get(`/guardians/${guardian.id}/communication?${queryParams.toString()}`)
            setLogs(response.data.data)
            if (response.data.stats) {
                setStats(response.data.stats)
            }
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

    // Re-fetch when filters change (or on initial mount if guardian.id exists)
    useEffect(() => {
        if (guardian?.id) {
            fetchLogs()
        }
    }, [guardian?.id, studentFilter, typeFilter, dateFrom, dateTo])


    const handleToggle = async (type: string, value: boolean) => {
        const key = type as keyof typeof preferences
        setUpdatingParams(prev => ({ ...prev, [type]: true }))

        // Optimistic update
        setPreferences(prev => ({ ...prev, [key]: value }))

        try {
            await api.put(`/guardians/${guardian.id}`, {
                [type]: value
            })

            toast({
                title: "Updated",
                description: `Communication preference updated successfully.`,
            })
        } catch (error) {
            console.error("Failed to update preference", error)
            // Revert on failure
            setPreferences(prev => ({ ...prev, [key]: !value }))
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update preference.",
            })
        } finally {
            setUpdatingParams(prev => {
                const copy = { ...prev }
                delete copy[type]
                return copy
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">All time interactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">SMS Sent</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.sms_count}</div>
                        <p className="text-xs text-muted-foreground">Text messages</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.email_count}</div>
                        <p className="text-xs text-muted-foreground">Email notifications</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Contact</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold truncate">
                            {stats.last_contact ? new Date(stats.last_contact).toLocaleDateString() : 'Never'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats.last_contact ? new Date(stats.last_contact).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Global Communication Preferences */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Communication Preferences</CardTitle>
                    <CardDescription className="text-xs">
                        Manage communication channels for this guardian. These settings apply to all linked students.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pref-sms"
                                checked={preferences.receives_sms}
                                onCheckedChange={(checked) => handleToggle('receives_sms', checked)}
                                disabled={!!updatingParams['receives_sms']}
                            />
                            <Label htmlFor="pref-sms">SMS Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pref-email"
                                checked={preferences.receives_email}
                                onCheckedChange={(checked) => handleToggle('receives_email', checked)}
                                disabled={!!updatingParams['receives_email']}
                            />
                            <Label htmlFor="pref-email">Email Notifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pref-whatsapp"
                                checked={preferences.receives_whatsapp}
                                onCheckedChange={(checked) => handleToggle('receives_whatsapp', checked)}
                                disabled={!!updatingParams['receives_whatsapp']}
                            />
                            <Label htmlFor="pref-whatsapp">WhatsApp</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pref-calls"
                                checked={preferences.receives_calls}
                                onCheckedChange={(checked) => handleToggle('receives_calls', checked)}
                                disabled={!!updatingParams['receives_calls']}
                            />
                            <Label htmlFor="pref-calls">Phone Calls</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="pref-portal"
                                checked={preferences.receives_portal}
                                onCheckedChange={(checked) => handleToggle('receives_portal', checked)}
                                disabled={!!updatingParams['receives_portal']}
                            />
                            <Label htmlFor="pref-portal">Portal Access</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium tracking-tight">Communication History</h3>
                    <SendMessageDialog
                        guardianId={guardian.id}
                        students={students}
                        onSuccess={fetchLogs}
                    />
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
                                    <SelectItem key={s.id} value={s.id.toString()}>
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
    )
}
