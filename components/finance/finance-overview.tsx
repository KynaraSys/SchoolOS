"use client"

import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Download, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FinanceOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Finance & Fee Management</h1>
          <p className="text-muted-foreground mt-1">Track fee collection, payments, and financial health</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Expected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">KSh 54.6M</div>
            <p className="text-xs text-muted-foreground mt-1">This term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Collected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-success">KSh 42.8M</div>
            <p className="text-xs text-muted-foreground mt-1">78.4% of target</p>
            <Progress value={78.4} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Outstanding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">KSh 11.8M</div>
            <p className="text-xs text-muted-foreground mt-1">21.6% remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              This Week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-semibold">KSh 1.2M</div>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-3 w-3" />
                <span>18%</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">342 transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>AI Payment Insights</CardTitle>
              <CardDescription>Smart recommendations for improving collection</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              Actionable
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 rounded-lg bg-background border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">15 Families Ready for Payment Plans</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on payment history, these families would benefit from structured payment plans. Potential
                recovery: KSh 850K
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Generate Plans
              </Button>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-background border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">8 Accounts at High Default Risk</p>
              <p className="text-xs text-muted-foreground mt-1">
                Early warning signs detected. Gentle reminders now could prevent KSh 340K in defaults.
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Send Reminders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Payments</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Accounts</TabsTrigger>
          <TabsTrigger value="by-class">By Class</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent M-Pesa Payments</CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "John Kamau", class: "Form 4A", amount: 45000, time: "2 hours ago", method: "M-Pesa" },
                  { name: "Mary Njeri", class: "Form 2B", amount: 38500, time: "3 hours ago", method: "M-Pesa" },
                  { name: "Peter Omondi", class: "Form 3B", amount: 42000, time: "5 hours ago", method: "Bank" },
                  { name: "Grace Wanjiku", class: "Form 1A", amount: 45000, time: "6 hours ago", method: "M-Pesa" },
                  { name: "David Mwangi", class: "Form 4B", amount: 35000, time: "8 hours ago", method: "Cash" },
                ].map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{payment.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.class} · {payment.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">KSh {payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{payment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Accounts</CardTitle>
              <CardDescription>30+ days past due</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "James Ochieng", class: "Form 3A", balance: 85000, days: 45 },
                  { name: "Alice Wangari", class: "Form 2B", balance: 72000, days: 38 },
                  { name: "Robert Kiprono", class: "Form 4A", balance: 65000, days: 35 },
                  { name: "Susan Akinyi", class: "Form 1B", balance: 90000, days: 32 },
                ].map((account, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-destructive/50 bg-destructive/5"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.class}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm font-semibold text-destructive">KSh {account.balance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{account.days} days overdue</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Contact
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-class" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collection by Class</CardTitle>
              <CardDescription>Current term performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { class: "Form 4", collected: 92, amount: "12.4M", expected: "13.5M" },
                  { class: "Form 3", collected: 85, amount: "11.2M", expected: "13.2M" },
                  { class: "Form 2", collected: 76, amount: "10.8M", expected: "14.2M" },
                  { class: "Form 1", collected: 68, amount: "8.4M", expected: "12.4M" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.class}</span>
                      <span className="text-muted-foreground">
                        {item.collected}% · KSh {item.amount} / {item.expected}
                      </span>
                    </div>
                    <Progress value={item.collected} />
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
