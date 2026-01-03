"use client"

import Link from "next/link"
import { BookOpen, Users, FileText, TrendingUp, Plus, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { getClasses, getSubjects } from "@/lib/api-academic"
import { SchoolClass, Subject } from "@/lib/types/academic"

export default function AcademicOverview() {
  const [stats, setStats] = useState({
    classes: 0,
    subjects: 0,
    pendingMarks: 0,
    schoolMean: 0
  })
  const [classesList, setClassesList] = useState<SchoolClass[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, subjectsData] = await Promise.all([
          getClasses(),
          getSubjects()
        ])

        setStats({
          classes: classesData.length,
          subjects: subjectsData.length,
          pendingMarks: 0, // Placeholder: Backend API needed
          schoolMean: 0    // Placeholder: Backend API needed
        })
        setClassesList(classesData.slice(0, 8)) // Show top 8 classes
      } catch (error) {
        console.error("Failed to fetch academic stats", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Academic Management</h1>
          <p className="text-muted-foreground mt-1">Classes, subjects, exams, and performance tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Reports</Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Exam
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Total Classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.classes}</div>
            <p className="text-xs text-muted-foreground mt-1">Active confirmed classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.subjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Curriculum subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Pending Marks Entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground mt-1">Data unavailable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              School Mean
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-muted-foreground">-</div>
            <p className="text-xs text-muted-foreground mt-1">This term</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/classes">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Classes & Streams</CardTitle>
              <CardDescription>Manage class structures and student assignments</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/subjects">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Subjects</CardTitle>
              <CardDescription>Subject setup and teacher assignments</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/academic/exams">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Exams & Assessment</CardTitle>
              <CardDescription>Create exams and manage assessment schedules</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/academic/marks">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Marks Entry</CardTitle>
              <CardDescription>Enter and moderate student results</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/academic/reports">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Report Cards</CardTitle>
              <CardDescription>Generate and download student reports</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/academic/cbc">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">CBC Competencies</CardTitle>
              <CardDescription>Track competency-based curriculum progress</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Performance by class */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance Overview</CardTitle>
          <CardDescription>Current term mean scores</CardDescription>
        </CardHeader>
        <CardContent>
          {classesList.length > 0 ? (
            <div className="space-y-4">
              {classesList.map((classItem, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <span className="font-medium">{classItem.name}</span>
                      <span className="text-muted-foreground ml-2">(N/A students)</span>
                    </div>
                    <span className="font-semibold text-muted-foreground">-</span>
                  </div>
                  <Progress value={0} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No classes found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
