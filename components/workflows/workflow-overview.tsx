"use client"

import { Workflow, Zap, CheckCircle2, Clock, AlertTriangle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function WorkflowOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Workflow Automation</h1>
          <p className="text-muted-foreground mt-1">Automated rules and intelligent escalation paths</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Active Workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Actions This Week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">247</div>
            <p className="text-xs text-muted-foreground mt-1">Automated actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Success Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">98.4%</div>
            <p className="text-xs text-muted-foreground mt-1">No failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">42</div>
            <p className="text-xs text-muted-foreground mt-1">Hours this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Active workflows */}
      <Card>
        <CardHeader>
          <CardTitle>Active Workflows</CardTitle>
          <CardDescription>Currently running automation rules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                name: "Attendance Alert - 3+ Days Absent",
                trigger: "Daily check at 9 AM",
                action: "Notify class teacher & send parent SMS",
                executions: 23,
                status: "active",
              },
              {
                name: "Fee Payment Reminder",
                trigger: "7 days before due date",
                action: "Send SMS and email to parent",
                executions: 156,
                status: "active",
              },
              {
                name: "Academic Risk Detection",
                trigger: "After exam results entry",
                action: "Flag students below 50%, notify academic director",
                executions: 12,
                status: "active",
              },
              {
                name: "Discipline Escalation",
                trigger: "3rd incident within term",
                action: "Escalate to deputy principal",
                executions: 3,
                status: "active",
              },
              {
                name: "M-Pesa Payment Reconciliation",
                trigger: "Hourly",
                action: "Match payments to student accounts",
                executions: 342,
                status: "active",
              },
            ].map((workflow, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{workflow.name}</p>
                      <Badge variant={workflow.status === "active" ? "default" : "secondary"}>{workflow.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Trigger:</span> {workflow.trigger}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Action:</span> {workflow.action}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold">{workflow.executions}</p>
                    <p className="text-xs text-muted-foreground">Executions</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    View Logs
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    Pause
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workflow Executions</CardTitle>
          <CardDescription>Last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                workflow: "Fee Payment Reminder",
                target: "15 parents",
                result: "Success",
                time: "2 hours ago",
                status: "success",
              },
              {
                workflow: "M-Pesa Reconciliation",
                target: "8 payments",
                result: "Matched",
                time: "3 hours ago",
                status: "success",
              },
              {
                workflow: "Attendance Alert",
                target: "4 students",
                result: "Teachers notified",
                time: "5 hours ago",
                status: "success",
              },
              {
                workflow: "Academic Risk Detection",
                target: "2 students",
                result: "Flagged for intervention",
                time: "Yesterday",
                status: "success",
              },
            ].map((execution, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      execution.status === "success" ? "bg-success/20" : "bg-destructive/20"
                    } flex-shrink-0`}
                  >
                    {execution.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{execution.workflow}</p>
                    <p className="text-xs text-muted-foreground">
                      {execution.target} · {execution.result}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{execution.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Workflow templates */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Templates</CardTitle>
          <CardDescription>Pre-built automation templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              {
                name: "Late Fee Reminder",
                description: "Automatically remind parents of overdue fees",
                category: "Finance",
              },
              {
                name: "Performance Alert",
                description: "Alert teachers when students drop below threshold",
                category: "Academic",
              },
              {
                name: "Absence Follow-up",
                description: "Contact parents after consecutive absences",
                category: "Attendance",
              },
              {
                name: "Exam Timetable Notification",
                description: "Send exam schedules to students and parents",
                category: "Communication",
              },
            ].map((template, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </div>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2 bg-transparent">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
