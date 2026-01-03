"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, Calendar, History, Trash2, ArrowRightLeft, UserX, User } from "lucide-react"
import { TeacherAssignmentModal } from "./teacher-assignment-modal"
import { toast } from "@/components/ui/use-toast"
import { User as UserType } from "@/lib/types/roles"
import { SchoolClass } from "@/lib/types/academic"
import { format } from "date-fns"

interface ClassTeacherAssignmentProps {
    schoolClass: SchoolClass & {
        currentTeacher?: {
            id: number
            user_id: string
            teacher?: UserType
            academic_year: string
            is_primary: boolean
            created_at: string
        } | null
    }
}

export function ClassTeacherAssignment({ schoolClass }: ClassTeacherAssignmentProps) {
    // State
    const [academicYear, setAcademicYear] = useState<string>(new Date().getFullYear().toString())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentTeacher, setCurrentTeacher] = useState<ClassTeacherAssignmentProps['schoolClass']['currentTeacher'] | null>(schoolClass.currentTeacher || null)

    // Handle Teacher Assignment
    const handleAssignTeacher = async (teacherId: string, year: string) => {
        try {
            const token = localStorage.getItem('token') // Basic auth handling
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/${teacherId}/assign-class`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ class_id: schoolClass.id, academic_year: year })
            })

            if (!response.ok) throw new Error('Failed to assign')

            const data = await response.json()

            toast({
                title: "Success",
                description: "Class teacher assigned successfully.",
            })

            // Refresh the page or update state to reflect changes
            window.location.reload()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign teacher.",
                variant: "destructive",
            })
        }
    }

    const handleRemoveAssignment = async () => {
        if (!confirm("Are you sure you want to remove this assignment? The class will have no primary teacher.")) return

        try {
            // Placeholder API call
            console.log("Removing assignment")

            toast({
                title: "Assignment Removed",
                description: "The class teacher assignment has been removed.",
            })
            setCurrentTeacher(null)
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove assignment.",
                variant: "destructive",
            })
        }
    }

    // Mock History Data
    const history = [
        { year: "2024", teacher: "Alice Johnson", assignedDate: "2024-01-10", changedBy: "Admin" },
        { year: "2023", teacher: "Mark Smith", assignedDate: "2023-01-05", changedBy: "Principal" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Class Teacher Assignment</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage the primary class teacher for this academic year.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Academic Year:</span>
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Current Teacher Card */}
            <Card className="border-l-4 border-l-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-primary" />
                        Current Class Teacher
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentTeacher ? (
                        <div className="flex items-start justify-between mt-2">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={currentTeacher.teacher?.avatar_url} />
                                    <AvatarFallback className="text-lg">
                                        {currentTeacher.teacher?.full_name?.substring(0, 2).toUpperCase() || "T"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-medium">{currentTeacher.teacher?.full_name}</h3>
                                    <p className="text-sm text-muted-foreground">{currentTeacher.teacher?.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                            Primary Class Teacher
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Assigned {format(new Date(currentTeacher.created_at || new Date()), "MMM d, yyyy")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                                    Change Teacher
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleRemoveAssignment}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Remove Assignment
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="bg-muted/50 p-4 rounded-full mb-3">
                                <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-lg">No Class Teacher Assigned</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mt-1 mb-4">
                                Assigning a class teacher enables "My Class" features for them.
                            </p>
                            <Button onClick={() => setIsModalOpen(true)}>
                                Assign Teacher
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Assignment History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Assignment History
                    </CardTitle>
                    <CardDescription>Historical record of teachers assigned to this class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Academic Year</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Assigned On</TableHead>
                                <TableHead>Changed By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{record.year}</TableCell>
                                    <TableCell>{record.teacher}</TableCell>
                                    <TableCell>{record.assignedDate}</TableCell>
                                    <TableCell>{record.changedBy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TeacherAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAssign={handleAssignTeacher}
                academicYear={academicYear}
                classId={schoolClass?.id?.toString() || ""}
            />
        </div>
    )
}
