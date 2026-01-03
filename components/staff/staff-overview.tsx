"use client"

import { UserCog, Users, Briefcase, Calendar, Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function StaffOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Staff & HR Management</h1>
          <p className="text-muted-foreground mt-1">Employee records, payroll, leave management</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">68</div>
            <p className="text-xs text-muted-foreground mt-1">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Teaching Staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">45</div>
            <p className="text-xs text-muted-foreground mt-1">Teachers & HODs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Support Staff
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">23</div>
            <p className="text-xs text-muted-foreground mt-1">Admin & operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              On Leave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Currently away</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search staff by name or employee number..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Staff Directory</CardTitle>
            <CardDescription>View all staff members and their details</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Payroll Management</CardTitle>
            <CardDescription>Process salaries and manage payroll</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Leave Management</CardTitle>
            <CardDescription>Track leave requests and balances</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Performance Appraisals</CardTitle>
            <CardDescription>Conduct and track staff evaluations</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Teacher Workload</CardTitle>
            <CardDescription>View teaching assignments and hours</CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-base">Recruitment</CardTitle>
            <CardDescription>Manage job postings and applications</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Staff by Department</CardTitle>
          <CardDescription>Breakdown of staff allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { department: "Mathematics Department", staff: 8, hod: "Mr. Ochieng" },
              { department: "Languages Department", staff: 7, hod: "Mrs. Njeri" },
              { department: "Sciences Department", staff: 12, hod: "Dr. Mwangi" },
              { department: "Humanities Department", staff: 9, hod: "Mr. Kamau" },
              { department: "Technical Department", staff: 6, hod: "Mrs. Wanjiru" },
              { department: "Administration", staff: 15, hod: "Ms. Akinyi" },
              { department: "Support Staff", staff: 11, hod: "Mr. Otieno" },
            ].map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium">{dept.department}</p>
                  <p className="text-xs text-muted-foreground">Head: {dept.hod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{dept.staff}</p>
                  <p className="text-xs text-muted-foreground">Staff</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leave requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
          <CardDescription>Requires approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { name: "Mrs. Njeri Wangari", type: "Annual Leave", dates: "Dec 20-27, 2024", days: 7 },
              { name: "Mr. Peter Kamau", type: "Sick Leave", dates: "Dec 19-20, 2024", days: 2 },
              { name: "Ms. Grace Mutua", type: "Maternity Leave", dates: "Jan 5 - Mar 5, 2025", days: 60 },
            ].map((request, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex-1">
                  <p className="text-sm font-medium">{request.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.type} · {request.dates}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{request.days} days</Badge>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
