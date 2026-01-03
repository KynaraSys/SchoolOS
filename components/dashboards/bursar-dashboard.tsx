"use client"

import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function BursarDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-balance">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-1">Comprehensive view of school finances and fee collection</p>
      </div>

      {/* Financial summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Collected (Term)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">KSh 42.8M</div>
            <p className="text-xs text-muted-foreground mt-1">78.4% of expected</p>
            <Progress value={78.4} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Outstanding Balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-destructive">KSh 2.8M</div>
            <p className="text-xs text-muted-foreground mt-1">47 accounts overdue 30+ days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
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

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Default Risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-warning">15</div>
            <p className="text-xs text-muted-foreground mt-1">Families predicted to default</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription>Personalized collection strategies</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary">
              New Insights
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 p-3 rounded-lg bg-background">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20 flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">15 Families Eligible for Payment Plans</p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on payment history and risk profile. Offering structured plans could recover KSh 850K.
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Generate Payment Plans
              </Button>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-lg bg-background">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 flex-shrink-0">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Early Intervention for 8 Accounts</p>
              <p className="text-xs text-muted-foreground mt-1">
                Accounts showing early warning signs. Gentle reminders now could prevent defaults.
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Send Reminders
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent payments */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent M-Pesa Payments</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "John Kamau", class: "Form 4A", amount: "45,000", time: "2 hours ago" },
                { name: "Mary Njeri", class: "Form 2B", amount: "38,500", time: "3 hours ago" },
                { name: "Peter Omondi", class: "Form 1C", amount: "42,000", time: "5 hours ago" },
                { name: "Grace Wanjiku", class: "Form 3A", amount: "45,000", time: "6 hours ago" },
              ].map((payment, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{payment.name}</p>
                    <p className="text-xs text-muted-foreground">{payment.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">KSh {payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection by Class</CardTitle>
            <CardDescription>Current term performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { class: "Form 4", collected: 92, amount: "12.4M" },
                { class: "Form 3", collected: 85, amount: "11.2M" },
                { class: "Form 2", collected: 76, amount: "10.8M" },
                { class: "Form 1", collected: 68, amount: "8.4M" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.class}</span>
                    <span className="text-muted-foreground">
                      {item.collected}% · KSh {item.amount}
                    </span>
                  </div>
                  <Progress value={item.collected} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
