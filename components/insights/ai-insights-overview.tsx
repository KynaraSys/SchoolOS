"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, AlertTriangle, Brain, Send, Sparkles, TrendingDown, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIInsightsOverview() {
  const [query, setQuery] = useState("")

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle query submission
    console.log("[v0] Query submitted:", query)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">AI Insights & Analytics</h1>
        <p className="text-muted-foreground mt-1">Intelligent analysis, predictions, and natural language queries</p>
      </div>

      {/* Natural Language Query */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>Ask Your School Data</CardTitle>
          </div>
          <CardDescription>Ask questions in plain English about your school's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleQuerySubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="e.g., Which students are at risk of failing this term?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Ask
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <p className="text-xs text-muted-foreground w-full mb-1">Suggested queries:</p>
            {[
              "Which students are at risk this term?",
              "Show fee defaulters by class",
              "Why is Form 3 underperforming?",
              "Teacher workload analysis",
              "Attendance patterns this week",
              "Compare streams performance",
            ].map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setQuery(suggestion)}
                className="text-xs bg-transparent"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="risk">
        <TabsList>
          <TabsTrigger value="risk">Academic Risk</TabsTrigger>
          <TabsTrigger value="fees">Fee Predictions</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Anomalies</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Students at Academic Risk</CardTitle>
                  <CardDescription>AI-predicted risk of academic failure based on multiple factors</CardDescription>
                </div>
                <Badge variant="destructive">28 Students</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "John Kamau",
                    class: "Form 3A",
                    risk: "High",
                    score: 42,
                    attendance: 82,
                    trend: "declining",
                    factors: ["Low test scores", "Poor attendance", "Declining engagement"],
                  },
                  {
                    name: "Mary Njeri",
                    class: "Form 2B",
                    risk: "High",
                    score: 48,
                    attendance: 88,
                    trend: "declining",
                    factors: ["Struggling in Math & Sciences", "Recent family issues"],
                  },
                  {
                    name: "Peter Omondi",
                    class: "Form 4B",
                    risk: "Medium",
                    score: 52,
                    attendance: 91,
                    trend: "stable",
                    factors: ["Borderline performance", "Needs extra support in English"],
                  },
                  {
                    name: "Grace Wanjiku",
                    class: "Form 1A",
                    risk: "Medium",
                    score: 54,
                    attendance: 94,
                    trend: "improving",
                    factors: ["Adjusting to secondary school", "Showing improvement"],
                  },
                ].map((student, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{student.name}</p>
                          <Badge variant={student.risk === "High" ? "destructive" : "secondary"}>{student.risk}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{student.score}%</p>
                        <p className="text-xs text-muted-foreground">Current avg</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-destructive" />
                        <span className="text-muted-foreground">
                          {student.trend === "declining"
                            ? "Declining"
                            : student.trend === "stable"
                              ? "Stable"
                              : "Improving"}
                        </span>
                      </div>
                      <div className="text-muted-foreground">Attendance: {student.attendance}%</div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-xs font-medium">Risk Factors:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                        {student.factors.map((factor, fidx) => (
                          <li key={fidx} className="list-disc">
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Create Intervention
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Explanation</CardTitle>
              <CardDescription>How academic risk is calculated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  The AI model analyzes multiple data points to predict academic risk:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Performance Trajectory:</strong> Comparing current scores with past performance to
                      identify declining trends
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Attendance Patterns:</strong> Correlating absences with performance drops
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Subject-Specific Struggles:</strong> Identifying weak areas across subjects
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      <strong>Historical Data:</strong> Learning from patterns of students who previously struggled
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Fee Default Predictions</CardTitle>
                  <CardDescription>Students at risk of fee payment default</CardDescription>
                </div>
                <Badge variant="destructive">15 Families</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    student: "James Ochieng",
                    class: "Form 3A",
                    balance: 85000,
                    risk: "High",
                    confidence: 87,
                    factors: ["History of late payments", "Large outstanding balance", "No recent payments"],
                  },
                  {
                    student: "Alice Wangari",
                    class: "Form 2B",
                    balance: 72000,
                    risk: "High",
                    confidence: 82,
                    factors: ["Payment pattern declining", "Multiple reminders sent"],
                  },
                  {
                    student: "Robert Kiprono",
                    class: "Form 4A",
                    balance: 65000,
                    risk: "Medium",
                    confidence: 71,
                    factors: ["Previously paid after reminders", "Payment plan history"],
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{item.student}</p>
                          <Badge variant={item.risk === "High" ? "destructive" : "secondary"}>{item.risk}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-warning">KSh {item.balance.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Outstanding</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">AI Confidence</span>
                        <span className="font-medium">{item.confidence}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 mb-3">
                      <p className="text-xs font-medium">Risk Indicators:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                        {item.factors.map((factor, fidx) => (
                          <li key={fidx} className="list-disc">
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Payment Plan
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        Contact Parent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Recommended Actions</CardTitle>
              </div>
              <CardDescription>AI-generated collection strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-sm font-medium mb-2">Offer Payment Plans</p>
                <p className="text-xs text-muted-foreground mb-2">
                  15 families would benefit from structured payment plans. Potential recovery: KSh 850K
                </p>
                <Button size="sm" variant="outline" className="bg-transparent">
                  Generate Plans
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-background border border-border">
                <p className="text-sm font-medium mb-2">Early Intervention</p>
                <p className="text-xs text-muted-foreground mb-2">
                  8 accounts showing early warning signs. Gentle reminders could prevent KSh 340K in defaults
                </p>
                <Button size="sm" variant="outline" className="bg-transparent">
                  Send Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Anomalies Detected</CardTitle>
              <CardDescription>Unusual patterns identified by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    pattern: "Form 2B - Unusual Absences on Mondays",
                    description: "12 students frequently absent on Mondays. Possible cause: Weekend activities",
                    severity: "Medium",
                    students: 12,
                  },
                  {
                    pattern: "Spike in Medical Absences - December",
                    description: "38% increase in medical absences this month. Possible flu outbreak",
                    severity: "High",
                    students: 47,
                  },
                  {
                    pattern: "Form 4A - Post-Exam Absences",
                    description: "Increased absences after mock exams. May indicate stress or burnout",
                    severity: "Medium",
                    students: 8,
                  },
                ].map((anomaly, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          <p className="text-sm font-medium">{anomaly.pattern}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{anomaly.description}</p>
                      </div>
                      <Badge variant={anomaly.severity === "High" ? "destructive" : "secondary"}>
                        {anomaly.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">{anomaly.students} students affected</p>
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights This Term</CardTitle>
              <CardDescription>AI-discovered patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3 p-4 rounded-lg bg-success/10 border border-success/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Form 2 Mathematics Improving</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mean score increased 12% since new teacher assignment. Strategy: Share best practices with other
                      streams
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-primary/10 border border-primary/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">CBC Competency Progress On Track</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      78% of Grade 7 students meeting or exceeding expected competencies. On track for national
                      assessment
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Science Lab Utilization Low</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lab booking down 23% this term. Correlation with lower science scores suggests need for more
                      practical work
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-accent border border-border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Teacher Workload Balanced</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI analysis shows teaching hours evenly distributed. No staff member exceeds recommended workload
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
