"use client"

import { useState } from "react"
import type { User } from "@/lib/types/roles"
import Link from "next/link"
import {
  Calendar,
  Users,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Bell,
  FileText,
  Plus,
  Shield,
  Megaphone,
  BrainCircuit,
  AlertCircle,
  MoreHorizontal,
  Mail,
  Search,
  ArrowUpRight,
  GraduationCap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { assessmentApi } from "@/lib/api-assessment"
import { useRouter } from "next/navigation"

// --- MOCK DATA ---

const SUBJECTS_PERFORMANCE = [
  { id: 1, subject: "Mathematics", stream: "Form 3A", mean: 72.5, trend: "up", atRisk: 2, students: 45 },
  { id: 2, subject: "Mathematics", stream: "Form 4A", mean: 68.2, trend: "down", atRisk: 4, students: 42 },
  { id: 3, subject: "Mathematics", stream: "Form 2B", mean: 75.0, trend: "up", atRisk: 1, students: 41 },
]

const TODAYS_LESSONS = [
  { id: 1, time: "08:00 - 09:20", subject: "Mathematics", class: "Form 3A", status: "completed", room: "Room 204", topic: "Quadratic Equations" },
  { id: 2, time: "10:30 - 11:50", subject: "Mathematics", class: "Form 4B", status: "upcoming", room: "Room 101", topic: "Calculus Intro" },
  { id: 3, time: "14:00 - 15:20", subject: "Mathematics", class: "Form 2A", status: "pending", room: "Lab 2", topic: "Vectors I" },
]

const AT_RISK_STUDENTS = [
  { id: 1, name: "David Kamau", class: "Form 4A", subject: "Mathematics", reason: "Declining Performance", score: "45%", trend: -12, avatar: "/avatars/01.png" },
  { id: 2, name: "Sarah Omondi", class: "Form 3A", subject: "Mathematics", reason: "Chronic Absence", attendance: "65%", trend: 0, avatar: "/avatars/02.png" },
  { id: 3, name: "Brian Kipkorir", class: "Form 4A", subject: "Mathematics", reason: "Missing Assignments", pending: 3, trend: -5, avatar: "/avatars/03.png" },
]

const PENDING_ASSIGNMENTS = [
  { id: 1, title: "Quadratic Equations", class: "Form 3A", type: "Homework", submitted: 38, total: 45, status: "marking_progress", dueDate: "Yesterday" },
  { id: 2, title: "Calculus Intro", class: "Form 4A", type: "Quiz", submitted: 42, total: 42, status: "completed", dueDate: "Today" },
  { id: 3, title: "Vectors I", class: "Form 2A", type: "Project", submitted: 12, total: 41, status: "open", dueDate: "Tomorrow" },
]

const INSIGHTS = [
  { id: 1, type: "performance", title: "Morning Advantage", description: "Form 3A scores 15% higher in morning lessons compared to afternoon." },
  { id: 2, type: "attendance", title: "Attendance Alert", description: "Friday afternoon attendance in Form 2A has dropped by 8% this month." },
]

export default function TeacherDashboard({ user }: { user?: User }) {
  const router = useRouter()
  const [assessmentStats, setAssessmentStats] = useState({
    pendingObservations: 0,
    completedToday: 0,
    atRiskLearners: 0
  })
  const [assessmentClasses, setAssessmentClasses] = useState<any[]>([])

  // Load Assessment Data
  useState(() => {
    const loadAssessmentData = async () => {
      // Mock data for now, similar to AssessmentPage
      setAssessmentStats({
        pendingObservations: 12,
        completedToday: 5,
        atRiskLearners: 3
      })

      setAssessmentClasses([
        {
          id: 1,
          name: "Grade 1 Blue",
          subject: "Mathematics",
          schedule: "08:00 AM",
          studentsCount: 24,
          pendingCount: 5
        },
        {
          id: 2,
          name: "Grade 2 Red",
          subject: "English Activities",
          schedule: "10:00 AM",
          studentsCount: 22,
          pendingCount: 0
        }
      ])
    }
    loadAssessmentData()
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const today = new Date()
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = today.toLocaleDateString('en-GB', dateOptions)

  const displayName = user?.full_name ? `Tr. ${user.full_name.split(' ')[0]}` : 'Teacher'

  return (
    <div className="space-y-6 pb-20">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-6 rounded-xl border backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{getGreeting()}, {displayName}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md"><Calendar className="h-4 w-4" /> {formattedDate}</span>
            <span className="hidden md:inline text-border">|</span>
            <Badge variant="outline" className="font-normal bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">Mathematics Deu pt</Badge>
            <Badge variant="outline" className="font-normal bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">3 Assigned Streams</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 hidden sm:flex">
            <Mail className="h-4 w-4" /> Messages
          </Button>
          <Button onClick={() => router.push('/teacher/assessments')} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> New Assessment
          </Button>
        </div>
      </div>

      {/* NEW: ASSESSMENT OVERVIEW SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">CBC Assessment Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Assessment Stats Cards */}
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending Observations</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{assessmentStats.pendingObservations}</div>
              <p className="text-xs text-amber-600/60 dark:text-amber-400/60">Needed today</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Completed Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{assessmentStats.completedToday}</div>
              <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60">Assessments recorded</p>
            </CardContent>
          </Card>
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-4 border-b bg-muted/40">
              <h3 className="font-semibold text-sm">Quick Access: Classes</h3>
            </div>
            <div className="divide-y">
              {assessmentClasses.map(cls => (
                <div
                  key={cls.id}
                  onClick={() => router.push(`/teacher/assessments?classId=${cls.id}`)}
                  className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{cls.subject}</p>
                  </div>
                  {cls.pendingCount > 0 && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">
                      {cls.pendingCount} Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Link href="/classes" className="block h-full">
          <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500 h-full hover:translate-y-[-2px] cursor-pointer group">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between group-hover:text-primary transition-colors">
                My Subjects <BookOpen className="h-4 w-4 opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Across 3 Forms</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/students" className="block h-full">
          <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-indigo-500 h-full hover:translate-y-[-2px] cursor-pointer group">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between group-hover:text-primary transition-colors">
                Students <Users className="h-4 w-4 opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground mt-1">Unique Learners</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/timetable" className="block h-full">
          <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-500 h-full hover:translate-y-[-2px] cursor-pointer group">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between group-hover:text-primary transition-colors">
                Today's Lessons <Clock className="h-4 w-4 opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-baseline gap-1">
                <div className="text-2xl font-bold">3</div>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
              <p className="text-xs text-amber-600 font-medium mt-1">Next: 10:30 AM (4B)</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/assignments" className="block h-full">
          <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500 h-full hover:translate-y-[-2px] cursor-pointer group">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between group-hover:text-primary transition-colors">
                Pending Work <FileText className="h-4 w-4 opacity-50" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">Ungraded Items</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/attendance" className="block h-full col-span-2 md:col-span-4 lg:col-span-1">
          <Card className="shadow-sm hover:shadow-md transition-all bg-destructive/5 border-destructive/20 text-destructive h-full hover:translate-y-[-2px] cursor-pointer group">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between group-hover:text-destructive/80 transition-colors">
                Alerts <AlertCircle className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs opacity-80 mt-1">Attendance Not Sent</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN (MAIN CONTENT) */}
        <div className="xl:col-span-2 space-y-6">

          {/* 3. TEACHING OVERVIEW */}
          <Card className="overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
              <div>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Overview of your assigned streams</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                View Detailed Reports <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Subject</TableHead>
                    <TableHead>Class / Stream</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Mean Score</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead className="text-right">At-Risk</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SUBJECTS_PERFORMANCE.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          {item.subject}
                        </div>
                      </TableCell>
                      <TableCell>{item.stream}</TableCell>
                      <TableCell>{item.students}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{item.mean.toFixed(1)}%</span>
                          <Progress value={item.mean} className="w-16 h-1.5" indicatorClassName={item.mean >= 70 ? "bg-green-500" : item.mean >= 50 ? "bg-amber-500" : "bg-red-500"} />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.trend === "up" ? (
                          <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-0.5 rounded-full w-fit">
                            <TrendingUp className="h-3 w-3 mr-1" /> Improving
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600 dark:text-red-400 text-xs font-semibold bg-red-500/10 px-2 py-0.5 rounded-full w-fit">
                            <TrendingDown className="h-3 w-3 mr-1" /> Declining
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.atRisk > 0 ? (
                          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900">
                            {item.atRisk} Students
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Analytics</DropdownMenuItem>
                            <DropdownMenuItem>Class List</DropdownMenuItem>
                            <DropdownMenuItem>Message Class</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 7. STUDENT RISK WATCH */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Student Risk Watch
                </CardTitle>
                <CardDescription>Students requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {AT_RISK_STUDENTS.map((student) => (
                  <div key={student.id} className="flex flex-col gap-3 p-3 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class} • {student.subject}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 border-0">
                        {student.reason}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-t pt-2 mt-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Current Score: <span className={parseInt(student.score) < 50 ? "text-red-600" : ""}>{student.score}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">Remark</Button>
                        <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                          Notify Guardian
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="w-full text-xs text-muted-foreground">View all 12 at-risk students</Button>
              </CardFooter>
            </Card>

            {/* 6. ASSIGNMENTS & ASSESSMENTS */}
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>Assignments</span>
                  <Badge variant="secondary" className="font-normal text-xs">{PENDING_ASSIGNMENTS.length} Active</Badge>
                </CardTitle>
                <CardDescription>Tracking marking and submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {PENDING_ASSIGNMENTS.map((assignment) => (
                  <div key={assignment.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate pr-2">{assignment.title}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{assignment.submitted}/{assignment.total}</span>
                    </div>
                    <Progress
                      value={(assignment.submitted / assignment.total) * 100}
                      className="h-2"
                      indicatorClassName={
                        assignment.status === 'marking_progress' ? 'bg-amber-500' :
                          assignment.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                      }
                    />
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      <span>{assignment.class} • {assignment.type}</span>
                      {assignment.status === 'marking_progress' && <span className="text-amber-600">Marking In Progress</span>}
                      {assignment.status === 'completed' && <span className="text-green-600">All Submitted</span>}
                      {assignment.status === 'open' && <span className="text-primary">Open</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-2 border-t bg-muted/10">
                <div className="w-full flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Enter Marks</Button>
                  <Button size="sm" className="flex-1 text-xs">Create New</Button>
                </div>
              </CardFooter>
            </Card>

          </div>

        </div>

        {/* RIGHT COLUMN (WIDGETS) */}
        <div className="space-y-6">

          {/* 4. TODAY'S TIMETABLE */}
          <Card className="h-fit">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Today's Schedule</span>
                <Badge variant="outline" className="bg-background font-normal">3 Lessons</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {TODAYS_LESSONS.map((lesson) => (
                  <div key={lesson.id} className="p-4 hover:bg-muted/50 transition-colors relative group">
                    {/* Active Indicator */}
                    {lesson.status === 'upcoming' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${lesson.status === 'active' || lesson.status === 'upcoming' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-transparent'}`}>
                          {lesson.time}
                        </span>
                      </div>
                      {lesson.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">{lesson.subject}</h4>
                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{lesson.class}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{lesson.topic}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                        {lesson.room}
                      </p>
                    </div>

                    <div className="mt-3 flex gap-2 opacity-100 transition-opacity">
                      {lesson.status !== 'completed' && (
                        <Button size="sm" className="h-7 text-xs w-full bg-primary/90 hover:bg-primary">
                          Take Attendance
                        </Button>
                      )}
                      {lesson.status === 'completed' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs w-full">
                          View Register
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 5. ATTENDANCE SNAPSHOT */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">My Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-bold">92%</span>
                  <span className="text-xs text-green-600 block flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +1.2% this week
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Form 3A</span>
                  <span className="font-medium">96%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Form 4B</span>
                  <span className="font-medium text-amber-600">88%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 10. AI TEACHING INSIGHTS */}
          <Card className="rounded-xl overflow-hidden border-indigo-100 dark:border-indigo-900 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background">
            <CardHeader className="pb-3 border-b border-indigo-100/50 dark:border-indigo-800/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <BrainCircuit className="h-4 w-4" />
                Teaching Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-indigo-100/50 dark:divide-indigo-800/50">
                {INSIGHTS.map((insight) => (
                  <div key={insight.id} className="p-4 hover:bg-white/50 dark:hover:bg-indigo-950/10 transition-colors">
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-md h-fit flex-shrink-0 ${insight.type === 'performance' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                        {insight.type === 'performance' ? <TrendingUp className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-semibold text-foreground">{insight.title}</h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="py-2 bg-indigo-50/50 dark:bg-indigo-950/30 justify-center">
              <Button variant="link" size="sm" className="text-indigo-600 dark:text-indigo-400 text-xs h-auto p-0">
                View all insights
              </Button>
            </CardFooter>
          </Card>

          {/* 8. COMMUNICATION PANEL (Quick Actions) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5 items-center justify-center hover:bg-primary/5 hover:border-primary/50 transition-all">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-[10px] font-medium">Take Attendance</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5 items-center justify-center hover:bg-orange-500/10 hover:border-orange-500/50 transition-all group">
                <Shield className="h-5 w-5 text-muted-foreground group-hover:text-orange-600" />
                <span className="text-[10px] font-medium group-hover:text-orange-600">Log Discipline</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5 items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group">
                <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-blue-600" />
                <span className="text-[10px] font-medium group-hover:text-blue-600">Message Parent</span>
              </Button>
              <Button variant="outline" className="h-auto py-3 flex flex-col gap-1.5 items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/50 transition-all group">
                <Megaphone className="h-5 w-5 text-muted-foreground group-hover:text-purple-600" />
                <span className="text-[10px] font-medium group-hover:text-purple-600">Notify Class Tr.</span>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
