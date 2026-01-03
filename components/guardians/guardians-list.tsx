"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Phone, Mail, Edit, Trash2, CheckCircle2, XCircle, User, Baby, MessageCircle, MessageSquare, Bell, PhoneCall } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import GuardianStatsCards from "@/components/guardians/guardian-stats-cards"

interface StudentPivot {
    is_primary: boolean
    receives_sms: boolean
    receives_email: boolean
}

interface Student {
    id: number
    name: string
    pivot: StudentPivot
}

interface Guardian {
    id: number
    first_name: string
    last_name: string
    phone_number: string
    email: string
    relationship_type: string
    created_at: string
    is_active: boolean
    last_login_at?: string
    receives_sms?: boolean
    receives_email?: boolean
    receives_whatsapp?: boolean
    receives_portal?: boolean
    receives_calls?: boolean
    students?: Student[]
}

export default function GuardiansList() {
    const router = useRouter()
    const [guardians, setGuardians] = useState<Guardian[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [studentNameFilter, setStudentNameFilter] = useState("")
    const [relationshipFilter, setRelationshipFilter] = useState("all")
    const [communicationFilter, setCommunicationFilter] = useState("all")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { toast } = useToast()

    const fetchGuardians = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append("page", page.toString())
            if (searchTerm) params.append("search", searchTerm)
            if (studentNameFilter) params.append("student_name", studentNameFilter)
            if (relationshipFilter && relationshipFilter !== "all") params.append("relationship_type", relationshipFilter)
            if (communicationFilter && communicationFilter !== "all") params.append("communication_preference", communicationFilter)

            const response = await api.get(`/guardians?${params.toString()}`)
            setGuardians(response.data.data)
            setTotalPages(response.data.last_page)
        } catch (error) {
            console.error("Failed to fetch guardians", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load guardians.",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchGuardians()
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, studentNameFilter, relationshipFilter, communicationFilter, page])

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this guardian? This will unlink them from all students.")) return

        try {
            await api.delete(`/guardians/${id}`)
            toast({ title: "Deleted", description: "Guardian deleted successfully." })
            fetchGuardians()
        } catch (error: any) {
            // Error handling is managed by the interceptor in api.ts, 
            // but for specific actions like this, we might want to ensure we don't double-toast 
            // OR ensure specific context is clear. 
            // The interceptor shows the error message from backend (e.g., "Cannot delete...").
            // So we don't strictly need to do anything here if the interceptor works, 
            // BUT the original code was suppressing/overriding it with a generic "Failed to delete guardian".

            // By re-throwing or just logging, we let the interceptor handle the UI toast.
            // However, the original code had its own toast. Let's rely on the interceptor 
            // OR explicitly show the error message here.

            const errorMessage = error.response?.data?.message || "Failed to delete guardian."

            // If the interceptor handled it, we might see two toasts if we add another one here.
            // The interceptor in api.ts shows a toast for ANY error unless rejected properly?
            // "return Promise.reject(error);" in interceptor means it propagates.

            // Let's rely on our specific message here to be safe and clear.
            // Actually, looking at api.ts, it shows a toast for *every* error. 
            // So we should probably NOT show another toast here, OR we should remove the generic one.
            // The issue reported was "API Error URL... failed to delete guardian" in console, meaning 
            // the catch block below WAS running and showing the generic error.

            // Correct approach: Just log it, or if we want to be sure, allow the interceptor to do its job.
            // But wait, the user's issue implies they saw the console error which comes from the `console.error` 
            // in the catch block or the interceptor? 
            // The user report says: "API Error URL: ... createConsoleError ... handleConsoleError". 
            // This suggests the error wasn't handled gracefully/visibly enough or the message was swallowed.
            // The original code:
            // catch (error: any) {
            //    toast({ ... "Failed to delete guardian." })
            // }
            // This OVERRID the backend message.

            // New approach: Extract message and show it, potentially duplicating if interceptor also fires, 
            // but ensures the message is seen. 
            // Optimally: Let's assume the interceptor fires (it does). 
            // We should just removing our generic toast to avoid swallowing/overriding or duplicating generic info.
            // However, if we want to be robust:

            // console.error("Delete failed", error); 
            // No custom toast needed if api.ts handles it.
            // BUT, if we want to ensure custom UI state (like valid/invalid inputs) we might keep it.
            // Given the user wants to SEE "Cannot delete...", the key is that `api.ts` extracts `error.response?.data?.message`.
            // So simply removing the generic toast here effectively "fixes" it by letting the global one show through,
            // OR modifying this one to be specific. 

            // Let's modify this one to be specific in case `api.ts` toast is disabled/filtered later.
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: errorMessage,
            })
        }
    }

    return (
        <div className="space-y-6">
            <GuardianStatsCards />

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <CardTitle>Guardian Directory</CardTitle>
                                <CardDescription>View and manage all registered guardians.</CardDescription>
                            </div>
                            {/* Primary Search */}
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, phone..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                            <div className="relative">
                                <Baby className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Student Name"
                                    className="pl-9"
                                    value={studentNameFilter}
                                    onChange={(e) => setStudentNameFilter(e.target.value)}
                                />
                            </div>
                            <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Relationships</SelectItem>
                                    <SelectItem value="Father">Father</SelectItem>
                                    <SelectItem value="Mother">Mother</SelectItem>
                                    <SelectItem value="Guardian">Guardian</SelectItem>
                                    <SelectItem value="Sponsor">Sponsor</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={communicationFilter} onValueChange={setCommunicationFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Communication" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Communication</SelectItem>
                                    <SelectItem value="sms">SMS Enabled</SelectItem>
                                    <SelectItem value="email">Email Enabled</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Placeholder for Class Filter if implemented later */}
                            {/* <Select>...</Select> */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : guardians.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No guardians found matching your criteria.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Relationship</TableHead>
                                            <TableHead>Linked Students</TableHead>
                                            <TableHead>Primary?</TableHead>
                                            <TableHead>Communication</TableHead>
                                            <TableHead>Status</TableHead>
                                            {/* <TableHead>Last Login</TableHead> */}
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {guardians.map((guardian) => {
                                            const linkedStudents = guardian.students || []
                                            const isPrimary = linkedStudents.some(s => s.pivot.is_primary)
                                            const receivesSMS = linkedStudents.some(s => s.pivot.receives_sms)
                                            const receivesEmail = linkedStudents.some(s => s.pivot.receives_email)

                                            return (
                                                <TableRow
                                                    key={guardian.id}
                                                    className="cursor-pointer hover:bg-muted/50"
                                                    onClick={() => router.push(`/guardians/${guardian.id}`)}
                                                >
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {guardian.first_name[0]}{guardian.last_name[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p>{guardian.first_name} {guardian.last_name}</p>
                                                                {guardian.last_login_at && <p className="text-xs text-muted-foreground">Last login: {new Date(guardian.last_login_at).toLocaleDateString()}</p>}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col text-sm space-y-1">
                                                            <span className="flex items-center gap-2">
                                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                                {guardian.phone_number}
                                                            </span>
                                                            {guardian.email && (
                                                                <span className="flex items-center gap-2">
                                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                                    {guardian.email}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{guardian.relationship_type}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                            <Badge variant="secondary" className="w-fit">
                                                                {linkedStudents.length} Students
                                                            </Badge>
                                                            {linkedStudents.length > 0 && (
                                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                                    {linkedStudents.map(s => s.name).join(", ")}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {isPrimary ? (
                                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Yes</Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {/* SMS */}
                                                            <div title="SMS" className={guardian.receives_sms ? 'text-green-600' : 'text-gray-300'}>
                                                                <MessageCircle className="h-4 w-4" />
                                                            </div>
                                                            {/* Email */}
                                                            <div title="Email" className={guardian.receives_email ? 'text-green-600' : 'text-gray-300'}>
                                                                <Mail className="h-4 w-4" />
                                                            </div>
                                                            {/* WhatsApp */}
                                                            <div title="WhatsApp" className={guardian.receives_whatsapp ? 'text-green-600' : 'text-gray-300'}>
                                                                <MessageSquare className="h-4 w-4" />
                                                            </div>
                                                            {/* Calls */}
                                                            <div title="Calls" className={guardian.receives_calls ? 'text-green-600' : 'text-gray-300'}>
                                                                <PhoneCall className="h-4 w-4" />
                                                            </div>
                                                            {/* Portal */}
                                                            <div title="Portal" className={guardian.receives_portal ? 'text-green-600' : 'text-gray-300'}>
                                                                <Bell className="h-4 w-4" />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={guardian.is_active ? 'default' : 'destructive'} className={guardian.is_active ? 'bg-green-500 hover:bg-green-600' : ''}>
                                                            {guardian.is_active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    {/*  <TableCell>
                                               <span className="text-xs text-muted-foreground">{guardian.last_login_at || 'Never'}</span>
                                            </TableCell> */}
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={() => router.push(`/guardians/${guardian.id}`)}>
                                                                <Edit className="h-4 w-4 text-muted-foreground" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="hover:bg-red-50 text-red-500 hover:text-red-700" onClick={() => handleDelete(guardian.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
