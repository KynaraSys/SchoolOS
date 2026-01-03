"use client"

import { User as UserType } from "@/lib/types/roles"
import {
  User,
  TrendingUp,
  Calendar,
  DollarSign,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ChevronRight,
  Clock,
  ShieldAlert,
  GraduationCap,
  Bus,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface ParentDashboardProps {
  user?: UserType
}

// Mock Data for Design Implementation
const mockStudents = [
  {
    id: "st_1",
    name: "Sarah Wanjiru",
    admission_no: "2022/0342",
    class: "Form 3A",
    avatar_color: "bg-pink-500/20 text-pink-500",
    attendance: { status: "Present", color: "text-emerald-500 bg-emerald-500/10", icon: CheckCircle2 },
    fee_balance: 18500,
    performance: { grade: "B+", trend: "upper-right" }
  },
  {
    id: "st_2",
    name: "Kevin Maina",
    admission_no: "2024/0118",
    class: "Form 1C",
    avatar_color: "bg-blue-500/20 text-blue-500",
    attendance: { status: "Absent", color: "text-rose-500 bg-rose-500/10", icon: AlertTriangle },
    fee_balance: 0,
    performance: { grade: "A-", trend: "upper-right" }
  }
]

const alerts = [
  {
    id: 1,
    title: "Kevin Maina is Absent",
    message: "Reported absent today. Please provide a reason if known.",
    type: "critical",
    time: "2 hours ago",
    icon: AlertTriangle,
    action: "Explain"
  },
  {
    id: 2,
    title: "Fee Clearance Required",
    message: "Sarah's Term 1 balance is due in 3 days.",
    type: "warning",
    time: "1 day ago",
    icon: DollarSign,
    action: "Pay Now"
  }
]

const announcements = [
  {
    id: 1,
    title: "End of Term 1 Closing Day",
    category: "Academic",
    date: "12 Apr",
    preview: "School will close for the April holidays on Friday, 12th April. Please ensure..."
  },
  {
    id: 2,
    title: "Form 3 Parents Meeting",
    category: "Events",
    date: "28 Mar",
    preview: "Mandatory meeting for all Form 3 parents regarding the upcoming academic trips..."
  }
]

export default function ParentDashboard({ user }: ParentDashboardProps) {
  const currentDate = new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.full_name?.split(' ')[0] || "Guardian"}
          </h1>
          <p className="text-gray-400 mt-1 text-base">
            {currentDate}
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#5c5fe5] hover:bg-[#4a4dbf] shadow-lg shadow-indigo-500/20 text-white border-0">
            <DollarSign className="mr-2 h-4 w-4" /> Pay Fees
          </Button>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.slice(0, 2).map((alert) => (
            <Card key={alert.id} className={`glass-card border-none relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${alert.type === 'critical' ? 'from-red-500/10' : 'from-orange-500/10'} to-transparent opacity-50`} />
              <CardContent className="p-4 flex items-start gap-4 relative z-10">
                <div className={`p-2 rounded-lg ${alert.type === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                  <alert.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-white">{alert.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </span>
                    {alert.action && (
                      <Button variant="link" size="sm" className={`h-auto p-0 ${alert.type === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                        {alert.action} <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Linked Students Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">My Children</h2>
          <Link href="/my-children" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockStudents.map((student) => (
            <Card key={student.id} className="glass-card border-none overflow-hidden hover:bg-white/5 transition-all duration-300 group">
              <div className="h-24 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className={`h-20 w-20 rounded-xl border-4 border-[#0F172A] shadow-md flex items-center justify-center text-xl font-bold ${student.avatar_color}`}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>
              <CardContent className="pt-12 px-6 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{student.name}</h3>
                    <p className="text-sm text-gray-400">{student.class} • {student.admission_no}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</p>
                    <Badge variant="outline" className={`${student.attendance.color} border-0 px-2 py-1`}>
                      <student.attendance.icon className="h-3 w-3 mr-1" /> {student.attendance.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academics</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{student.performance.grade}</span>
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-400">Fee Balance</span>
                    <span className={`text-sm font-bold ${student.fee_balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      KSh {student.fee_balance.toLocaleString()}
                    </span>
                  </div>
                  {student.fee_balance > 0 && <Progress value={30} className="h-1.5 bg-white/10" indicatorClassName="bg-red-500" />}
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50">
                    Profile
                  </Button>
                  <Button variant="outline" className="flex-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50">
                    Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Child placeholder for growth */}
          <Card className="border-2 border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-6 text-center hover:border-primary/50 hover:bg-white/5 transition-all duration-300 cursor-pointer text-gray-500 hover:text-primary min-h-[300px]">
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <User className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-lg">Link Another Child</h3>
            <p className="text-sm mt-2 max-w-[200px]">Have another child in this school? Request linkage here.</p>
          </Card>
        </div>
      </section>

      {/* Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Latest Announcements */}
        <Card className="col-span-1 lg:col-span-2 glass-card border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-400" />
              <CardTitle className="text-lg text-white">Latest Announcements</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[250px]">
              <div className="divide-y divide-white/5">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="secondary" className="text-xs font-normal bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20">
                        {announcement.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{announcement.date}</span>
                    </div>
                    <h4 className="font-semibold text-gray-200 text-sm mb-1 group-hover:text-indigo-400">{announcement.title}</h4>
                    <p className="text-xs text-gray-400 line-clamp-2">{announcement.preview}</p>
                  </div>
                ))}
                <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="secondary" className="text-xs font-normal bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20">
                      Transport
                    </Badge>
                    <span className="text-xs text-gray-500">22 Mar</span>
                  </div>
                  <h4 className="font-semibold text-gray-200 text-sm mb-1 group-hover:text-orange-400">Bus Route 4 Schedule Change</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">Due to road maintenance on Waiyaki Way, the morning pick-up time...</p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-2 text-center border-t border-white/5">
            <p className="w-full text-xs text-gray-500">Checked recently</p>
          </CardFooter>
        </Card>

        {/* Quick Actions / Fee Summary */}
        <div className="space-y-6">
          <Card className="glass-card border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-indigo-600/20 to-purple-700/20 pb-6 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                <DollarSign className="h-5 w-5 opacity-80" /> Fee Summary
              </CardTitle>
              <p className="text-indigo-200 text-sm mt-1">Total Outstanding</p>
              <div className="text-3xl font-bold mt-2 text-white">KSh 18,500</div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-gray-300">Sarah Wanjiru</span>
                  <span className="font-semibold text-red-400">KSh 18,500</span>
                </div>
                <div className="flex justify-between text-sm p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-gray-300">Kevin Maina</span>
                  <span className="font-semibold text-emerald-400">Cleared</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                Pay Now (M-Pesa)
              </Button>
            </CardFooter>
          </Card>

          <Card className="glass-card border-none relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-50" />
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Transport Status</h4>
                  <p className="text-xs text-gray-400">Bus 4 arriving in 15 mins</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
