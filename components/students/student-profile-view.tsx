"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, DollarSign, ShieldAlert, Activity, Edit, MoreVertical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface StudentProfileViewProps {
  studentId: string
}

export default function StudentProfileView({ studentId }: StudentProfileViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock student data
  const student = {
    id: studentId,
    admNo: "2022/0342",
    name: "Sarah Wanjiru Kamau",
    class: "Form 3A",
    gender: "Female",
    dob: "2008-03-15",
    age: 16,
    guardianName: "James Kamau",
    guardianPhone: "+254 712 345 678",
    attendance: 97.8,
    performance: 78.7,
    feeBalance: 18500,
    status: "active",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold">{student.name}</h1>
          <p className="text-muted-foreground mt-1">
            {student.admNo} · {student.class}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Transfer Student</DropdownMenuItem>
              <DropdownMenuItem>Generate Report</DropdownMenuItem>
              <DropdownMenuItem>Contact Guardian</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Overall Grade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">B+</div>
            <p className="text-xs text-muted-foreground mt-1">Mean: {student.performance}%</p>
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
            <div className="text-2xl font-semibold">{student.attendance}%</div>
            <p className="text-xs text-muted-foreground mt-1">2 days absent this term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Fee Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-warning">KSh {student.feeBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Payment plan available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Discipline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">Clean</div>
            <p className="text-xs text-muted-foreground mt-1">No incidents</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="discipline">Discipline</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Full Name</span>
                  <span className="text-sm font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Admission Number</span>
                  <span className="text-sm font-medium">{student.admNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="text-sm font-medium">{student.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date of Birth</span>
                  <span className="text-sm font-medium">{student.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm font-medium">{student.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <span className="text-sm font-medium">{student.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guardian Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Guardian Name</span>
                  <span className="text-sm font-medium">{student.guardianName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone Number</span>
                  <span className="text-sm font-medium">{student.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium">james.kamau@email.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Relationship</span>
                  <span className="text-sm font-medium">Father</span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Contact Guardian
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Automated analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 p-3 rounded-lg bg-success/10 border border-success/50">
                <Activity className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Strong Academic Performance</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consistent improvement across subjects. Biology and English are particular strengths.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-lg bg-warning/10 border border-warning/50">
                <Activity className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Fee Payment Pattern</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Guardian typically pays in the second week of term. Current balance within normal range.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Current term results and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { subject: "Mathematics", score: 78, grade: "B", teacher: "Mr. Ochieng" },
                  { subject: "English", score: 82, grade: "A-", teacher: "Mrs. Njeri" },
                  { subject: "Kiswahili", score: 75, grade: "B", teacher: "Mr. Mwangi" },
                  { subject: "Biology", score: 85, grade: "A", teacher: "Mr. Kamau" },
                  { subject: "Chemistry", score: 72, grade: "B-", teacher: "Dr. Mwangi" },
                  { subject: "Physics", score: 80, grade: "A-", teacher: "Mr. Omondi" },
                  { subject: "History", score: 76, grade: "B", teacher: "Mrs. Wanjiru" },
                  { subject: "Geography", score: 79, grade: "B+", teacher: "Mr. Otieno" },
                ].map((subject, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{subject.subject}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{subject.score}%</span>
                            <Badge variant="outline">{subject.grade}</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{subject.teacher}</p>
                      </div>
                    </div>
                    <Progress value={subject.score} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>This term</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                  <div>
                    <p className="text-sm font-medium">Total School Days</p>
                    <p className="text-xs text-muted-foreground">This term</p>
                  </div>
                  <span className="text-2xl font-semibold">92</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
                  <div>
                    <p className="text-sm font-medium">Days Present</p>
                    <p className="text-xs text-muted-foreground">On time and accounted</p>
                  </div>
                  <span className="text-2xl font-semibold text-success">90</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                  <div>
                    <p className="text-sm font-medium">Days Absent</p>
                    <p className="text-xs text-muted-foreground">Excused absences</p>
                  </div>
                  <span className="text-2xl font-semibold text-destructive">2</span>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Attendance Rate</p>
                  <Progress value={97.8} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">97.8% - Excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Statement</CardTitle>
              <CardDescription>Current term financial summary</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between p-3 rounded-lg bg-accent">
                <span className="text-sm text-muted-foreground">Total Term Fees</span>
                <span className="text-sm font-semibold">KSh 45,000</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-success/10">
                <span className="text-sm text-muted-foreground">Amount Paid</span>
                <span className="text-sm font-semibold text-success">KSh 26,500</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-warning/10">
                <span className="text-sm text-muted-foreground">Outstanding Balance</span>
                <span className="text-sm font-semibold text-warning">KSh 18,500</span>
              </div>
              <div className="pt-2">
                <Button className="w-full">Send Payment Reminder</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discipline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discipline Record</CardTitle>
              <CardDescription>Behavioral incidents and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 mb-4">
                  <ShieldAlert className="h-8 w-8 text-success" />
                </div>
                <p className="font-medium">Clean Record</p>
                <p className="text-sm text-muted-foreground mt-1">No discipline incidents recorded this term</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Recommended Interventions</CardTitle>
              <CardDescription>Personalized support strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">No Interventions Needed</p>
                <p className="text-sm text-muted-foreground mt-1">Student is performing well across all metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
