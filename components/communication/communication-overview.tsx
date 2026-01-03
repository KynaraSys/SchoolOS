"use client"

import { Send, Users, CheckCircle2, Plus, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CommunicationOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Communication Center</h1>
          <p className="text-muted-foreground mt-1">Announcements, messaging, and parent communication</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Messages Sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">1,247</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Delivery Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">98.7%</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">2,394</div>
            <p className="text-xs text-muted-foreground mt-1">Parents & students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Pending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="announcements">
        <TabsList>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Messaging</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>School-wide and class-specific announcements</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    title: "Term 1 Exam Timetable Released",
                    audience: "All Students & Parents",
                    date: "Dec 18, 2024",
                    status: "sent",
                    recipients: 2394,
                  },
                  {
                    title: "Sports Day Postponed",
                    audience: "All Students & Parents",
                    date: "Dec 17, 2024",
                    status: "sent",
                    recipients: 2394,
                  },
                  {
                    title: "Form 4 Career Guidance Session",
                    audience: "Form 4 Students",
                    date: "Dec 16, 2024",
                    status: "sent",
                    recipients: 156,
                  },
                  {
                    title: "Parent-Teacher Meeting Reminder",
                    audience: "All Parents",
                    date: "Dec 15, 2024",
                    status: "sent",
                    recipients: 1247,
                  },
                ].map((announcement, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          To: {announcement.audience} · {announcement.recipients.toLocaleString()} recipients
                        </p>
                      </div>
                      <Badge variant={announcement.status === "sent" ? "default" : "secondary"}>
                        {announcement.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{announcement.date}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Resend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Bulk Message</CardTitle>
              <CardDescription>Send SMS or email to multiple recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/50">
                  <p className="text-sm font-medium mb-2">Quick Bulk Message</p>
                  <p className="text-xs text-muted-foreground mb-4">Select recipient group and compose your message</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Button variant="outline" className="justify-start bg-transparent">
                      All Parents
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent">
                      All Students
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent">
                      Specific Class
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent">
                      Custom Group
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Recent Bulk Messages</p>
                  {[
                    {
                      content: "Term exams start next week. Please ensure students are well prepared...",
                      recipients: 1247,
                      date: "Dec 18, 2024",
                      delivered: 1234,
                    },
                    {
                      content: "Reminder: Fee balance due by December 22nd. Pay via M-Pesa...",
                      recipients: 342,
                      date: "Dec 15, 2024",
                      delivered: 340,
                    },
                  ].map((message, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border">
                      <p className="text-sm line-clamp-1">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {message.delivered}/{message.recipients} delivered · {message.date}
                        </p>
                        <Button size="sm" variant="ghost">
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>Pre-written templates for common messages</CardDescription>
                </div>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    name: "Fee Reminder",
                    category: "Finance",
                    preview: "Dear parent, this is to remind you that the term fee balance is due...",
                  },
                  {
                    name: "Exam Notification",
                    category: "Academic",
                    preview: "The end of term exams will begin on [date]. Please ensure your child...",
                  },
                  {
                    name: "Absence Follow-up",
                    category: "Attendance",
                    preview: "We noticed that [student name] has been absent for [days] consecutive days...",
                  },
                  {
                    name: "Achievement Congratulations",
                    category: "General",
                    preview: "Congratulations! [Student name] has achieved excellent results in...",
                  },
                  {
                    name: "Discipline Notice",
                    category: "Discipline",
                    preview: "This is to inform you that [student name] was involved in a behavioral incident...",
                  },
                  {
                    name: "Event Invitation",
                    category: "Events",
                    preview: "You are invited to attend [event name] on [date] at [time]...",
                  },
                ].map((template, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium">{template.name}</p>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.preview}</p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Reports</CardTitle>
              <CardDescription>Track message delivery status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    message: "Term 1 Exam Timetable Released",
                    sent: 1247,
                    delivered: 1234,
                    failed: 13,
                    rate: 98.96,
                    date: "Dec 18, 2024",
                  },
                  {
                    message: "Fee Payment Reminder",
                    sent: 342,
                    delivered: 340,
                    failed: 2,
                    rate: 99.42,
                    date: "Dec 17, 2024",
                  },
                  {
                    message: "Sports Day Postponed",
                    sent: 1247,
                    delivered: 1230,
                    failed: 17,
                    rate: 98.64,
                    date: "Dec 16, 2024",
                  },
                ].map((report, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{report.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                      </div>
                      <Badge variant={report.rate > 98 ? "default" : "secondary"}>{report.rate}%</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-semibold">{report.sent}</p>
                        <p className="text-xs text-muted-foreground">Sent</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-success">{report.delivered}</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-destructive">{report.failed}</p>
                        <p className="text-xs text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
