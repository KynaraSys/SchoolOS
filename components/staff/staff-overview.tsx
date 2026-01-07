"use client"

import { UserCog, Users, Briefcase, Calendar, Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import AddStaffDialog from "./add-staff-dialog"
import { getUsers } from "@/lib/api-users"

function StatsCard({ title, value, icon: Icon, description }: any) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function StaffOverview() {
  // const [isAddOpen, setIsAddOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    teachers: 0,
    support: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ensure we fetch ALL staff by setting all=true
        // Using updated scopeStaff logic on the backend (not Student/Parent)
        // We rely on client-side counting for now to avoid multiple API calls or new endpoints
        // Ideally /users/stats would be better.

        const data = await getUsers(1, true, { type: 'staff' })
        const staff = Array.isArray(data) ? data : data.data

        const teachers = staff.filter((u: any) => u.roles.some((r: any) => r.name === 'Teacher')).length
        const total = staff.length

        setStats({
          total,
          teachers,
          support: total - teachers
        })
      } catch (error) {
        console.error("Failed to fetch staff stats", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Staff & HR Management</h1>
          <p className="text-muted-foreground mt-1">Employee records, payroll, leave management</p>
        </div>
        <Link href="/admin/staff/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Staff Member
          </Button>
        </Link>
      </div>

      {/* <AddStaffDialog open={isAddOpen} onOpenChange={setIsAddOpen} /> */}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Staff"
          value={stats.total}
          icon={Users}
          description="Active employees"
        />
        <StatsCard
          title="Teaching Staff"
          value={stats.teachers}
          icon={UserCog}
          description="Teachers & HODs"
        />
        <StatsCard
          title="Support Staff"
          value={stats.support}
          icon={Briefcase}
          description="Admin & operations"
        />
        <StatsCard
          title="On Leave"
          value={0} // TODO: Implement leave tracking
          icon={Calendar}
          description="Currently away"
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/staff/directory">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-base">Staff Directory</CardTitle>
              <CardDescription>View all staff members and their details</CardDescription>
            </CardHeader>
          </Card>
        </Link>

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
