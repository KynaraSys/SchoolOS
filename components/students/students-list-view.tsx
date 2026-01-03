"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { Search, Filter, Download, Plus, User, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StudentForm } from "@/components/students/student-form"
import { StudentImportDialog } from "@/components/students/student-import-dialog"
import { getStudents, exportStudents, deleteStudent } from "@/lib/api-users"

export default function StudentsListView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudents() // Fetch from new endpoint

        // Map to UI structure
        const mappedStudents = response.map((u: any) => ({
          id: u.id.toString(),
          // Use real data from relation if available, fallback to mock if using old data
          admNo: u.student?.admission_number || `2024/${u.id.toString().padStart(4, '0')}`,
          name: u.name,
          // Class still mocked or retrieved from relation if we seeded classes (we didn't seed classes yet)
          // Class still mocked or retrieved from relation if we seeded classes (we didn't seed classes yet)
          class: u.student?.school_class ? `${u.student.school_class.name} ${u.student.school_class.stream || ''}` : 'Not Assigned',
          attendance: u.student?.current_risk?.risk_score ?? Math.floor(Math.random() * (100 - 80) + 80), // Use Real Risk Score or Mock
          riskLevel: u.student?.current_risk?.risk_level ?? 'low',
          performance: Math.floor(Math.random() * (100 - 50) + 50), // Still mocked
          feeStatus: ['paid', 'partial', 'overdue'][Math.floor(Math.random() * 3)], // Still mocked
          status: u.is_active ? 'active' : 'inactive',
          createdAt: new Date(u.created_at || new Date()),
          profile_image: u.profile_image,
        }))
        setStudents(mappedStudents)
      } catch (error) {
        console.error("Failed to fetch students", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [])


  const filteredStudents = students.filter((student) => {
    // Search query filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admNo.toLowerCase().includes(searchQuery.toLowerCase())

    // Class filter
    let matchesClass = true
    if (classFilter !== "all") {
      // Normalize filter value "form1" -> "Form 1" to match data "Form 1A" start
      const formattedFilter = classFilter.replace("form", "Form ")
      matchesClass = student.class.startsWith(formattedFilter)
    }

    // Status filter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesClass && matchesStatus
  })


  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!studentToDelete) return

    try {
      await deleteStudent(studentToDelete)
      setStudents(students.filter(s => s.id !== studentToDelete))
      setStudentToDelete(null)
    } catch (error) {
      console.error("Failed to delete student", error)
      alert("Failed to delete student")
    }
  }

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
      <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student account and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            // Re-fetch students on success
            const fetchStudents = async () => {
              const response = await getStudents()
              const mappedStudents = response.map((u: any) => ({
                id: u.id.toString(),
                admNo: u.student?.admission_number || `2024/${u.id.toString().padStart(4, '0')}`,
                name: u.name,
                class: u.student?.school_class ? `${u.student.school_class.name} ${u.student.school_class.stream || ''}` : 'Not Assigned',
                attendance: Math.floor(Math.random() * (100 - 80) + 80),
                performance: Math.floor(Math.random() * (100 - 50) + 50),
                feeStatus: ['paid', 'partial', 'overdue'][Math.floor(Math.random() * 3)],
                status: u.is_active ? 'active' : 'inactive',
                createdAt: new Date(u.created_at || new Date()),
                profile_image: u.profile_image,
              }))
              setStudents(mappedStudents)
            }
            fetchStudents()
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
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="form1">Form 1</SelectItem>
                  <SelectItem value="form2">Form 2</SelectItem>
                  <SelectItem value="form3">Form 3</SelectItem>
                  <SelectItem value="form4">Form 4</SelectItem>
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
              <Button variant="outline" size="icon">
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
                        {student.admNo} · {student.class}
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
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      setStudentToDelete(student.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
