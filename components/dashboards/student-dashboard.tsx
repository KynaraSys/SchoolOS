"use client"

import { BookOpen, Calendar, Award, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Welcome, Sarah!</h1>
        <p className="text-muted-foreground mt-1">Form 3A · Here's your overview for today</p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Overall Grade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">B+</div>
            <p className="text-xs text-muted-foreground mt-1">Mean: 78.7%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Class Rank
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">8/42</div>
            <p className="text-xs text-muted-foreground mt-1">Top 20%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">97.8%</div>
            <p className="text-xs text-success mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Excellent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Pending Tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments due</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
          <CardDescription>Thursday, December 19, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: "8:00 AM", subject: "Mathematics", teacher: "Mr. Ochieng", room: "204", status: "completed" },
              { time: "10:00 AM", subject: "English", teacher: "Mrs. Njeri", room: "301", status: "completed" },
              { time: "12:00 PM", subject: "Biology", teacher: "Mr. Kamau", room: "Lab 2", status: "current" },
              { time: "2:00 PM", subject: "Chemistry", teacher: "Dr. Mwangi", room: "Lab 1", status: "upcoming" },
              { time: "4:00 PM", subject: "Physics", teacher: "Mr. Omondi", room: "Lab 3", status: "upcoming" },
            ].map((lesson, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <div className="flex flex-col items-center justify-center px-3 border-r border-border">
                  <span className="text-sm font-semibold">{lesson.time.split(" ")[0]}</span>
                  <span className="text-xs text-muted-foreground">{lesson.time.split(" ")[1]}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{lesson.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {lesson.teacher} · Room {lesson.room}
                  </p>
                </div>
                <Badge
                  variant={
                    lesson.status === "current" ? "default" : lesson.status === "completed" ? "secondary" : "outline"
                  }
                >
                  {lesson.status === "current" ? "Now" : lesson.status === "completed" ? "Done" : "Upcoming"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignments and Performance */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Assignments</CardTitle>
            <CardDescription>Complete before deadline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Biology Lab Report</p>
                  <p className="text-xs text-muted-foreground">Due: December 20, 2024</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Submit
              </Button>
            </div>

            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium">English Essay - Climate Change</p>
                  <p className="text-xs text-muted-foreground">Due: December 22, 2024</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Submit
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Math Problem Set 14</p>
                  <p className="text-xs text-muted-foreground">Due: December 27, 2024</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Latest test scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: "Biology", score: 85, grade: "A", date: "Dec 15" },
                { subject: "Mathematics", score: 78, grade: "B", date: "Dec 12" },
                { subject: "English", score: 82, grade: "A-", date: "Dec 10" },
                { subject: "Chemistry", score: 72, grade: "B-", date: "Dec 8" },
              ].map((result, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{result.subject}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{result.score}%</span>
                        <Badge variant="outline">{result.grade}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{result.date}</p>
                    <Progress value={result.score} className="mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
