"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Save, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getClassAttendance, submitAttendance } from "@/lib/api-attendance"

export default function MarkAttendance({ classId, className }: { classId: string, className?: string }) {
    const router = useRouter()
    const [students, setStudents] = useState<any[]>([])
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [isLoading, setIsLoading] = useState(true)
    const [classDetails, setClassDetails] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const data = await getClassAttendance(classId, date)
                setStudents(data.students.map((s: any) => ({
                    ...s,
                    // status is null if not marked, default to present or keep null to force marking? 
                    // Let's default to present if null for easier workflow, or keep null to show "Unmarked"
                    status: s.status || 'present',
                    remarks: s.remarks || ''
                })))
                setClassDetails({ name: data.class })
            } catch (error: any) {
                console.error("Failed to load students", error)
                if (error.response && error.response.status === 404) {
                    toast.error("Class not found")
                    // Optional: Redirect back
                    // router.push("/attendance")
                } else {
                    toast.error("Failed to load students")
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [classId, date])

    const updateStatus = (id: string, status: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s))
    }

    const updateRemarks = (id: string, remarks: string) => {
        setStudents(students.map(s => s.id === id ? { ...s, remarks } : s))
    }

    const markAllPresent = () => {
        setStudents(students.map(s => ({ ...s, status: "present" })))
    }

    const handleSubmit = async () => {
        try {
            await submitAttendance(classId, date, students.map(s => ({
                student_id: s.id,
                status: s.status,
                remarks: s.remarks
            })))
            toast.success("Attendance submitted successfully")
            router.push("/attendance")
        } catch (error) {
            console.error(error)
            toast.error("Failed to submit attendance")
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Mark Attendance</h1>
                    <p className="text-muted-foreground">{className || classDetails?.name || "Class Attendance"}</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border rounded-md p-2 bg-background">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-auto border-0 h-auto p-0 focus-visible:ring-0"
                        />
                    </div>
                    <Button onClick={markAllPresent} variant="outline">Mark All Present</Button>
                    <Button onClick={handleSubmit}>
                        <Save className="mr-2 h-4 w-4" />
                        Submit
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {students.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No students found in this class.</div>
                ) : (
                    students.map((student) => (
                        <Card key={student.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                                    {/* Student Info */}
                                    <div className="flex items-center gap-3 w-full md:w-1/4">
                                        <Avatar>
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{student.name}</p>
                                            <p className="text-xs text-muted-foreground">ADM: {student.adm}</p>
                                        </div>
                                    </div>

                                    {/* Status Toggles */}
                                    <div className="flex items-center justify-center gap-2 w-full md:w-1/2">
                                        <Button
                                            variant="ghost"
                                            className={`flex-1 flex gap-2 border ${student.status === 'present' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'border-border opacity-60'}`}
                                            onClick={() => updateStatus(student.id, 'present')}
                                        >
                                            <CheckCircle2 className={`h-4 w-4 ${student.status === 'present' ? 'text-green-600' : 'text-muted-foreground'}`} />
                                            Present
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className={`flex-1 flex gap-2 border ${student.status === 'absent' ? 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500' : 'border-border opacity-60'}`}
                                            onClick={() => updateStatus(student.id, 'absent')}
                                        >
                                            <XCircle className={`h-4 w-4 ${student.status === 'absent' ? 'text-red-600' : 'text-muted-foreground'}`} />
                                            Absent
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className={`flex-1 flex gap-2 border ${student.status === 'late' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500' : 'border-border opacity-60'}`}
                                            onClick={() => updateStatus(student.id, 'late')}
                                        >
                                            <Clock className={`h-4 w-4 ${student.status === 'late' ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                                            Late
                                        </Button>
                                    </div>

                                    {/* Remarks */}
                                    <div className="w-full md:w-1/4">
                                        <Input
                                            placeholder="Remarks (optional)"
                                            value={student.remarks}
                                            onChange={(e) => updateRemarks(student.id, e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
