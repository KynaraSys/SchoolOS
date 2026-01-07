"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { Search, Filter, Download, Plus, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StudentForm } from "@/components/students/student-form"
import { StudentImportDialog } from "@/components/students/student-import-dialog"
import { getStudents, exportStudents, deleteStudent } from "@/lib/api-users"
import { getClasses } from "@/lib/api-academic"

export default function StudentsListView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all") // Stores class Name or "all"
  const [streamFilter, setStreamFilter] = useState("all") // Stores stream name or "all"
  const [statusFilter, setStatusFilter] = useState("all")
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching students and classes...");

        // Fetch independently to identify which one fails
        let studentsData: any[] = [];
        let classesData: any[] = [];

        try {
          studentsData = await getStudents();
          console.log("Students fetched:", studentsData?.length);
        } catch (e) {
          console.error("Failed to fetch students:", e);
        }

        try {
          classesData = await getClasses();
          console.log("Classes fetched:", classesData?.length);
        } catch (e) {
          console.error("Failed to fetch classes:", e);
        }

        setClasses(classesData || []);

        if (studentsData) {
          // Map to UI structure
          const mappedStudents = studentsData.map((u: any) => ({
            id: u.id.toString(),
            admNo: u.student?.admission_number || `2024/${u.id.toString().padStart(4, '0')}`,
            name: u.name,
            // Store raw class data for filtering
            classId: u.student?.school_class?.id?.toString(),
            className: u.student?.school_class?.name,
            classStream: u.student?.school_class?.stream,
            // Display string
            classDisplay: u.student?.school_class ? `${u.student.school_class.name} ${u.student.school_class.stream || ''}` : 'Not Assigned',
            attendance: u.student?.current_risk?.risk_score ?? Math.floor(Math.random() * (100 - 80) + 80),
            riskLevel: u.student?.current_risk?.risk_level ?? 'low',
            performance: Math.floor(Math.random() * (100 - 50) + 50),
            feeStatus: ['paid', 'partial', 'overdue'][Math.floor(Math.random() * 3)],
            status: u.is_active ? 'active' : 'inactive',
            createdAt: new Date(u.created_at || new Date()),
            profile_image: u.profile_image,
            guardiansCount: u.guardians?.length || 0,
          }))
          setStudents(mappedStudents)
        }
      } catch (error) {
        console.error("Critical error in fetchData", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])


  const filteredStudents = students.filter((student) => {
    // Search query filter
    const matchesSearch =
      student.name.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, "")) ||
      student.admNo.toLowerCase().replace(/\s+/g, "").includes(searchQuery.toLowerCase().replace(/\s+/g, ""))

    // Class filter
    let matchesClass = true
    if (classFilter !== "all") {
      matchesClass = student.className === classFilter
    }

    // Stream filter
    let matchesStream = true
    if (classFilter !== "all" && streamFilter !== "all") {
      matchesStream = student.classStream === streamFilter
    }

    // Status filter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesClass && matchesStream && matchesStatus
  })

  // Derive unique streams for the selected class to populate the stream dropdown
  // We use class names for the filter to group all streams of the same grade level (e.g. "Grade 1")
  const uniqueClassNames = Array.from(new Set(classes.map(c => c.name))).sort();

  // Calculate statistics
  const totalStudents = students.length
  const activeStudents = students.filter(s => s.status === 'active').length
  const newStudents = students.filter(s => {
    const date = new Date(s.createdAt)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
    return date > threeMonthsAgo
  }).length

  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length * 10) / 10
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={async () => {
            try {
              const blob = await exportStudents()
              const url = window.URL.createObjectURL(new Blob([blob]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'students_export.csv');
              document.body.appendChild(link);
              link.click();
              link.parentNode?.removeChild(link);
            } catch (error) {
              console.error("Export failed", error)
              alert("Failed to export students") // Simple alert for now
            }
          }}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <StudentImportDialog onSuccess={() => {
            window.location.reload() // Simplest way to refresh for now
          }} />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's details to create a new account.
                </DialogDescription>
              </DialogHeader>
              <StudentForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">{activeStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New This Term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-primary">{newStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{avgAttendance}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or admission number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {/* Dynamically populated Class Filter */}
              <Select
                value={classFilter}
                onValueChange={(val) => {
                  setClassFilter(val)
                  setStreamFilter("all") // Reset stream when class changes
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClassNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Stream Filter - conditioned on Class Selection */}
              <Select
                value={streamFilter}
                onValueChange={setStreamFilter}
                disabled={classFilter === "all"}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  {/* 
                     We need streams associated with the selected CLASS NAME.
                   */}
                  {classes
                    .filter(c => c.name === classFilter)
                    .map(c => c.stream)
                    .filter(s => s)
                    .filter((value, index, self) => self.indexOf(value) === index) // Unique
                    .sort()
                    .map(stream => (
                      <SelectItem key={stream} value={stream}>{stream}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="transferred">Transferred</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => {
                setClassFilter("all")
                setStatusFilter("all")
                setStreamFilter("all")
                setSearchQuery("")
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Records ({filteredStudents.length})</CardTitle>
          <CardDescription>Click on a student to view detailed profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No students found matching your search.
              </div>
            ) : (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors group relative"
                >
                  <Link
                    href={`/students/${student.id}`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={student.profile_image} className="object-cover" />
                      <AvatarFallback className="text-primary bg-primary/20">{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.admNo} · {student.classDisplay}
                      </p>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Attendance Risk</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{student.attendance}</span>
                          {student.riskLevel !== 'low' && (
                            <Badge variant={student.riskLevel === 'high' ? 'destructive' : 'secondary'} className={student.riskLevel === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}>
                              {student.riskLevel.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <p className="text-sm font-semibold">{student.performance}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Fees</p>
                        <Badge
                          variant={
                            student.feeStatus === "paid"
                              ? "default"
                              : student.feeStatus === "partial"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {student.feeStatus === "paid" ? "Paid" : student.feeStatus === "partial" ? "Partial" : "Overdue"}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Guardians</p>
                        <div className="flex items-center justify-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm font-semibold">{student.guardiansCount}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </CardContent >
      </Card >
    </div >
  )
}
