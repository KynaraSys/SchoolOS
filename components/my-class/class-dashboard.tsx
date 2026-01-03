"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, AlertTriangle, BookOpen, Calendar, ArrowUpRight, ArrowDownRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MyClassDashboard() {
    // Mock Data for "Form 4 Mars"
    const classStats = {
        name: "Form 4 Mars",
        year: "2024",
        term: "Term 3",
        students: 42,
        meanScore: 8.4,
        meanGrade: "B-",
        rank: "2nd out of 4 Streams",
        attendance: 96.5,
        attendanceTrend: "+1.2%",
        riskCount: 3
    }

    const termTrendData = [
        { name: 'Term 1 2023', score: 7.8 },
        { name: 'Term 2 2023', score: 8.1 },
        { name: 'Term 3 2023', score: 8.0 },
        { name: 'Term 1 2024', score: 8.2 },
        { name: 'Term 2 2024', score: 8.0 },
        { name: 'Term 3 2024', score: 8.4 },
    ];

    const riskStudents = [
        { name: "David Kimani", risk: "High", reason: "Attendance < 80%", trend: "dropping" },
        { name: "Sarah Omondi", risk: "Medium", reason: "Math & Chem failing", trend: "stable" },
        { name: "James Mwangi", risk: "Medium", reason: "Discipline Issues", trend: "improving" },
    ]

    const subjectPerformance = [
        { subject: "Mathematics", mean: 7.2, grade: "C+", trend: "up" },
        { subject: "English", mean: 9.1, grade: "B", trend: "up" },
        { subject: "Chemistry", mean: 6.5, grade: "C", trend: "down" },
        { subject: "History", mean: 10.2, grade: "A-", trend: "stable" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">{classStats.name}</h1>
                        <Badge variant="outline" className="text-base px-3 py-1 bg-primary/10 text-primary border-primary/20">
                            Class Teacher
                        </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Overview for {classStats.term}, {classStats.year} • {classStats.students} Students</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/my-class/students">
                            <Users className="mr-2 h-4 w-4" />
                            Manage Students
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/my-class/forecasting">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            View Forecasts
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Class Mean Score</CardTitle>
                        <GraduationCap className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{classStats.meanScore} <span className="text-lg text-gray-400 font-normal">({classStats.meanGrade})</span></div>
                        <p className="text-xs text-green-400 mt-1 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +0.4 from last term
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Stream Rank</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{classStats.rank}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Top stream: Form 4 Venus (8.6)
                        </p>
                    </CardContent>
                </Card>
                <Card className="glass-card border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">Attendance</CardTitle>
                        <Calendar className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{classStats.attendance}%</div>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span className="text-green-400 flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3" /> {classStats.attendanceTrend}
                            </span>
                            vs School Avg (94%)
                        </div>
                    </CardContent>
                </Card>
                <Card className={`glass-card border-none ${classStats.riskCount > 0 ? "border-l-4 border-l-red-500" : ""}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-300">At-Risk Students</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{classStats.riskCount}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Require immediate intervention
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Risk Heatmap / List */}
                <Card className="col-span-3 glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-white">Risk Watchlist</CardTitle>
                        <CardDescription className="text-gray-400">Students flagged by the Early Warning System</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {riskStudents.map((student, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${student.risk === 'High' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                                        <div>
                                            <p className="font-bold text-sm text-white">{student.name}</p>
                                            <p className="text-xs text-gray-400">{student.reason}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={student.risk === 'High' ? 'text-red-400 border-red-500/50 bg-red-500/10' : 'text-orange-400 border-orange-500/50 bg-orange-500/10'}>{student.risk}</Badge>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs text-primary hover:text-white hover:bg-white/10">
                            View All Risk Factors <ArrowUpRight className="ml-1 h-3 w-3" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Subject Performance Overview */}
                <Card className="col-span-4 glass-card border-none">
                    <CardHeader>
                        <CardTitle className="text-white">Subject Performance</CardTitle>
                        <CardDescription className="text-gray-400">Contribution to Mean Score</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {subjectPerformance.map((subject, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-white">{subject.subject}</span>
                                        <span className="text-gray-400">{subject.mean} ({subject.grade})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Progress value={(subject.mean / 12) * 100} className="h-2 bg-white/10" />
                                        {subject.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                                        {subject.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                                        {subject.trend === 'stable' && <span className="text-xs text-gray-500">-</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Term Trend Graph */}
            <Card className="glass-card border-none">
                <CardHeader>
                    <CardTitle className="text-white">Term Performance Trend</CardTitle>
                    <CardDescription className="text-gray-400">Mean score progression over the last 6 terms</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={termTrendData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0075FF" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0075FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="name"
                                stroke="#A0AEC0"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[0, 12]}
                                stroke="#A0AEC0"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ background: 'rgba(17, 28, 68, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                labelStyle={{ color: '#fff', marginBottom: '4px' }}
                                itemStyle={{ color: '#0075FF' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#0075FF"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: "#0B1437", stroke: "#0075FF" }}
                                activeDot={{ r: 8, strokeWidth: 0, fill: "#0075FF" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

        </div>
    )
}
