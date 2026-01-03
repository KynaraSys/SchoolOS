"use client"

import { useState } from "react"
import { Plus, UserMinus, Star, MessageSquare, AlertCircle, TrendingUp, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import api from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StudentPivot {
    is_primary: boolean
    receives_sms: boolean
    receives_email: boolean
}

interface Student {
    id: number
    name: string
    pivot: StudentPivot
    student?: {
        admission_number: string
        school_class?: {
            name: string
            stream: string
        }
        payments?: any[]
    }
}

interface LinkedStudentsProps {
    guardianId: number
    students: Student[]
    onUpdate: () => void
}

export default function LinkedStudents({ guardianId, students, onUpdate }: LinkedStudentsProps) {
    const { toast } = useToast()
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const handleTogglePrimary = async (student: Student) => {
        try {
            setLoadingId(student.id)
            await api.put(`/guardians/${guardianId}/students/${student.id}`, {
                is_primary: !student.pivot.is_primary
            })
            toast({ title: "Updated", description: "Primary guardian status updated." })
            onUpdate()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update." })
        } finally {
            setLoadingId(null)
        }
    }

    const handleToggleComm = async (student: Student, type: 'sms' | 'email') => {
        try {
            setLoadingId(student.id)
            const payload = type === 'sms'
                ? { receives_sms: !student.pivot.receives_sms }
                : { receives_email: !student.pivot.receives_email }

            await api.put(`/guardians/${guardianId}/students/${student.id}`, payload)
            toast({ title: "Updated", description: "Communication preference updated." })
            onUpdate()
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update." })
        } finally {
            setLoadingId(null)
        }
    }

    const handleUnlink = async (studentId: number) => {
        if (!confirm("Are you sure you want to remove this student from this guardian?")) return

        try {
            setLoadingId(studentId)
            await api.post(`/guardians/unlink`, {
                guardian_id: guardianId,
                student_id: studentId
            })
            toast({ title: "Removed", description: "Student unlinked successfully." })
            onUpdate()
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.message || "Failed to unlink student."
            })
        } finally {
            setLoadingId(null)
        }
    }

    // Mock Fee Balance Calculation (since Invoice model not found)
    // In real app: Invoice Total - Payment Total
    // For now: Random mock or just show "Check Finance"
    const getFeeBalance = (student: Student) => {
        // return (Math.random() * 10000).toFixed(2); 
        return "15,000" // Placeholder
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Linked Students</CardTitle>
                    <CardDescription>Students under this guardian's responsibility.</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast({ title: "Feature Coming Soon", description: "Add Student wrapper to be implemented." })}>
                    <Plus className="mr-2 h-4 w-4" /> Add Student
                </Button>
            </CardHeader>
            <CardContent>
                {students.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No students linked to this guardian.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Details</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Academic</TableHead>
                                <TableHead>Fee Balance</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Discipline</TableHead>
                                <TableHead>Settings</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => {
                                const details = student.student
                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{details?.admission_number || "N/A"}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {details?.school_class ? `${details.school_class.name} ${details.school_class.stream || ''}` : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200"> Good Standing</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-red-600">
                                            KES {getFeeBalance(student)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">98%</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <AlertCircle className="h-3 w-3" /> 0
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={student.pivot.is_primary ? "text-yellow-500 hover:text-yellow-600" : "text-gray-300 hover:text-yellow-500"}
                                                                onClick={() => handleTogglePrimary(student)}
                                                                disabled={loadingId === student.id}
                                                            >
                                                                <Star className="h-4 w-4 fill-current" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{student.pivot.is_primary ? "Primary Guardian" : "Mark as Primary"}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={student.pivot.receives_sms ? "text-blue-500" : "text-gray-300"}
                                                                onClick={() => handleToggleComm(student, 'sms')}
                                                                disabled={loadingId === student.id}
                                                            >
                                                                <MessageSquare className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>SMS Notifications: {student.pivot.receives_sms ? "On" : "Off"}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                onClick={() => handleUnlink(student.id)}
                                                disabled={loadingId === student.id}
                                            >
                                                <UserMinus className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}
