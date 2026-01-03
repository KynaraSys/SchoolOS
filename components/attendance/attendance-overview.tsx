"use client"

import { useEffect, useState } from "react"
import { Calendar, TrendingDown, AlertTriangle, CheckCircle2, Users, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getAttendanceOverview } from "@/lib/api-attendance"

export default function AttendanceOverview() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await getAttendanceOverview()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch attendance config", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  // Fallback if stats fail
  const data = stats || {
    total_students: 0,
    present_count: 0,
    absent_count: 0,
    attendance_rate: 0,
    term_average: 0,
    class_stats: [],
    absentees: [],
    high_risk_count: 0,
    high_risk_students: []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Attendance Management</h1>
          <p className="text-muted-foreground mt-1">Track daily attendance and identify patterns</p>
        </div>
      </div>

      {/* Actionable: Classes to Mark */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Mark Today's Attendance</CardTitle>
          <CardDescription>Select a class to submit daily attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {/* Dynamic Class Links */}
            {data.class_stats.length > 0 ? (
              data.class_stats.map((cls: any) => (
                <Button key={cls.id} asChild className="h-auto py-4 px-6 flex flex-col items-start gap-1" variant="outline">
                  <Link href={`/attendance/mark/${cls.id}`}>
                    <span className="font-bold text-base">{cls.class}</span>
                    <span className="text-xs opacity-90 font-light">Daily Roll Call</span>
                  </Link>
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground">No classes found.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{data.total_students}</div>
            <p className="text-xs text-muted-foreground mt-1">Active enrollment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Present Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">{data.present_count}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.attendance_rate}% attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Absent Today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">{data.absent_count}</div>
            <p className="text-xs text-muted-foreground mt-1">{data.total_students > 0 ? ((data.absent_count / data.total_students) * 100).toFixed(1) : 0}% of students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Term Average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{data.term_average}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 90 Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle className="text-base">Absentees Today</CardTitle>
              </div>
              <Badge variant="outline" className="border-destructive text-destructive">
                {data.absent_count} Students
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Students marked absent today requiring follow-up.</p>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => document.getElementById('absentees-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View List
            </Button>
          </CardContent>
        </Card>

        <Card className="border-warning/50 bg-warning/5">
          {/* Placeholder for future risk integration */}
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <CardTitle className="text-base">High Risk Students</CardTitle>
              </div>
              <Badge variant="outline" className="border-warning text-warning">
                {data.high_risk_count ?? 0} Students
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Students with chronic absenteeism trends.</p>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => document.getElementById('high-risk-list')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Check Risks
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Attendance by class */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance by Class</CardTitle>
          <CardDescription>Today's attendance rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.class_stats.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No class data available yet today.</div>
            ) : (
              data.class_stats.map((classData: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{classData.class}</span>
                      <span className="text-muted-foreground ml-2">
                        {classData.present}/{classData.total}
                      </span>
                    </div>
                    <span className="font-semibold">{classData.percentage}%</span>
                  </div>
                  <Progress value={classData.percentage} />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent absences */}
      <Card id="absentees-list">
        <CardHeader>
          <CardTitle>Students Absent Today</CardTitle>
          <CardDescription>Requires follow-up</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!data.absentees || data.absentees.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No absences recorded today.</div>
            ) : (
              data.absentees.map((student: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold">1 day</p>
                      <p className="text-xs text-muted-foreground">Recent</p>
                    </div>
                    <Badge variant={student.status === "excused" ? "outline" : "destructive"}>
                      {student.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Watchlist */}
      <Card id="high-risk-list" className="border-warning/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>High Risk Watchlist</CardTitle>
              <CardDescription>Students with critical attendance issues ({data.high_risk_students?.length || 0})</CardDescription>
            </div>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {!data.high_risk_students || data.high_risk_students.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No high risk students detected.</div>
            ) : (
              data.high_risk_students.map((student: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-warning/5">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold text-warning">{student.risk_score}% Risk</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/students/${student.id}`}>View Profile</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
