"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MyClassStudentsPage() {
    // Mock student data
    const students = Array.from({ length: 15 }).map((_, i) => ({
        id: i + 1,
        name: `Student ${i + 1}`,
        regNumber: `ADM/2024/0${i + 10}`,
        attendance: 85 + (i % 15),
        grade: ["A", "A-", "B+", "B", "B-"][i % 5],
        status: i % 7 === 0 ? "At Risk" : "Active"
    }))

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Student Roster</CardTitle>
                        <CardDescription>Manage student profiles and performance.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search students..." className="pl-8" />
                        </div>
                        <Button>Export List</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">{student.regNumber}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 text-sm">
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground text-xs">Avg. Grade</span>
                                    <span className="font-semibold">{student.grade}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-muted-foreground text-xs">Attendance</span>
                                    <span className={`${student.attendance < 90 ? "text-yellow-500" : "text-green-500"} font-semibold`}>
                                        {student.attendance}%
                                    </span>
                                </div>
                                <div className="w-24 flex justify-end">
                                    {student.status === "At Risk" ? (
                                        <Badge variant="destructive">At Risk</Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm">View Profile</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
