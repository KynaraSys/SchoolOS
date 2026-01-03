"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, AlertCircle, FileBarChart, Edit, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ExamsDashboard() {
    const { user } = useAuth()

    // Mock data
    const exams = [
        {
            id: "exam-001",
            name: "End of Term 3 Exams",
            startDate: "2024-11-25",
            status: "Results Entry",
            classes: ["Form 3A", "Form 2B", "Form 4A"],
            progress: 65
        },
        {
            id: "exam-002",
            name: "Continuous Assessment Test 2",
            startDate: "2024-10-15",
            status: "Published",
            classes: ["Form 3A", "Form 2B"],
            progress: 100
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Exams & Results</h1>
                    <p className="text-muted-foreground mt-1">Manage assessments, enter marks, and view analysis.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Exams Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Active Examinations</CardTitle>
                        <CardDescription>Assessments currently in progress or grading</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {exams.map(exam => (
                            <div key={exam.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                <div className="space-y-1 mb-4 md:mb-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-lg">{exam.name}</h3>
                                        <Badge variant={exam.status === 'Published' ? 'secondary' : 'default'}>{exam.status}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Started: {exam.startDate}</span>
                                        <span>•</span>
                                        <span>{exam.classes.join(", ")}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {exam.status === 'Results Entry' && (
                                        <Button asChild>
                                            <Link href={`/exams/${exam.id}/entry`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Enter Marks
                                            </Link>
                                        </Button>
                                    )}
                                    <Button variant="outline" asChild>
                                        <Link href={`/exams/${exam.id}/analysis`}>
                                            <FileBarChart className="mr-2 h-4 w-4" />
                                            Analysis
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Analytics Preview */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Subject Mean Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.4 (B-)</div>
                        <div className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +0.3 from last term
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Entry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1 Class</div>
                        <p className="text-xs text-muted-foreground mt-1">Form 3A - Mathematics</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full py-6">
                        <div className="rounded-full bg-primary/10 p-3 mb-2">
                            <ArrowRight className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-medium">View Past Results</span>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
