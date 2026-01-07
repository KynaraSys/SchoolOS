"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { AlertTriangle, TrendingUp, Users, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ClassOverview {
    id: number
    name: string
    academic_year: string
    student_count: number
    attendance_rate: number
    performance_avg: number
}

export default function MyClassOverviewPage() {
    const [data, setData] = useState<ClassOverview | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasAssignment, setHasAssignment] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/teacher/my-class')

                // Check if teacher has a class assignment
                if (response.data.has_assignment === false) {
                    setHasAssignment(false)
                    setData(null)
                } else {
                    setHasAssignment(true)
                    setData(response.data.class_details)
                }
                setError(null)
            } catch (error) {
                console.error("API Error", error)
                setError("Unable to load class details.")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <div className="flex justify-center p-8"><Spinner /></div>
    }

    if (error) {
        return (
            <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-6 text-center text-muted-foreground">
                    {error}
                </CardContent>
            </Card>
        )
    }

    // Teacher has no class assignment
    if (!hasAssignment) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No Class Assignment</p>
                    <p className="text-sm text-muted-foreground">You haven't been assigned to a class yet. Please contact the administration.</p>
                </CardContent>
            </Card>
        )
    }

    // Teacher has a class but no students enrolled
    if (data && data.student_count === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No students in this class</p>
                    <p className="text-sm text-muted-foreground">Students will appear here once they are enrolled in your class.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Top Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-primary/10 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Class Competency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Matching Exp.</div>
                        <p className="text-xs text-muted-foreground">Most students on track</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.student_count ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Total Enrolled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.attendance_rate ?? 0}%</div>
                        <p className="text-xs text-muted-foreground">Weekly Average</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">3</div>
                        <p className="text-xs text-muted-foreground">Require intervention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Competency Growth</CardTitle>
                        <CardDescription>Term-over-term competency level progression.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center bg-black/20 rounded-lg border border-white/5 mx-6 mb-6">
                        <p className="text-muted-foreground text-sm">Chart Placeholder (Use existing Recharts component)</p>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>At-Risk Students</CardTitle>
                        <CardDescription>Students flagged for immediate attention.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">Student Name {i}</p>
                                        <p className="text-xs text-muted-foreground">Needs support in Math & Science</p>
                                    </div>
                                    <Badge variant="destructive">Critical</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
