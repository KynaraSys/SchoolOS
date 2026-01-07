"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export default function MyClassStudentsPage() {
    const [students, setStudents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch the class overview which now includes students
                const res = await api.get('/teacher/my-class')

                if (res.data) {
                    const data = res.data
                    // The controller returns { class_details: {...}, students: [...] }
                    if (data.students) {
                        setStudents(data.students)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch class students", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStudents()
    }, [])

    const filteredStudents = students.filter(student => {
        const name = student.name || ""
        const reg = student.regNumber || ""
        return name.toLowerCase().replace(/\s+/g, "").includes(searchTerm.toLowerCase().replace(/\s+/g, "")) ||
            reg.toLowerCase().replace(/\s+/g, "").includes(searchTerm.toLowerCase().replace(/\s+/g, ""))
    })

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading Class Data...</div>
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Student Roster</CardTitle>
                        <CardDescription>Manage student profiles and competency progress.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button>Export List</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground border rounded-lg border-dashed">
                            No students found in your class.
                        </div>
                    ) : filteredStudents.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback>{(student.name || "S")[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{student.name || "Unknown Name"}</p>
                                    <p className="text-xs text-muted-foreground">{student.regNumber || "No Reg No"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground text-xs">Competency Level</span>
                                    <span className={`font-semibold ${student.competency === "Exceeding" ? "text-green-600" :
                                        student.competency === "Meeting" ? "text-blue-600" :
                                            student.competency === "Approaching" ? "text-amber-600" : "text-red-600"
                                        }`}>{student.competency || "-"}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground text-xs">Attendance</span>
                                    <span className={`${(student.attendance || 0) < 90 ? "text-yellow-500" : "text-green-500"} font-semibold`}>
                                        {student.attendance || 0}%
                                    </span>
                                </div>
                                <div className="w-24 flex justify-end">
                                    {student.status === "At Risk" ? (
                                        <Badge variant="destructive">At Risk</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/students/${student.id}`}>
                                        View Profile
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
